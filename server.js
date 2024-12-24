const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const cors = require("cors");
const axios = require('axios');

const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Statik dosyalar için dizin ayarla
app.use(express.static(path.join(__dirname)));

// Ana sayfayı yönlendirme
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// MongoDB bağlantı bilgileri
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "translate";


app.use(cors());
app.use(bodyParser.json());

// Kullanıcı ismini getirme
app.get("/user", async (req, res) => {
    const { email } = req.query;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('user');

        const user = await collection.findOne({ email });
        if (user) {
            res.status(200).send({ name: user.name, email: user.email });
        } else {
            res.status(404).send({ message: "Kullanıcı bulunamadı." });
        }
    } catch (err) {
        console.error("Backend Hatası:", err.message);
        res.status(500).send({ message: "Bir hata oluştu.", error: err.message });
    }
});

app.get('/get-user-info', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "E-posta bilgisi gerekli." });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('user');

        // E-posta ile kullanıcıyı bulun
        const user = await usersCollection.findOne({ email });

        if (user) {
            // Kullanıcı bilgilerini döndür
            res.status(200).json({ username: user.username, email: user.email });
        } else {
            res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Kullanıcı bilgisi alınırken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası." });
    }
});



// Giriş İşlemi
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // İstemciden gelen email ve şifre bilgilerini al

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('user');

        const user = await usersCollection.findOne({ email }); // Bu eposta ile bir kayıt olup olmadığını kontrol et
        if (!user) {
            return res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Gelen şifre ile veritabanındaki şifreyi karşılaştır
        if (!isPasswordValid) {
            return res.json({ success: false, message: 'Şifre yanlış.' });
        }

        // Kullanıcının yetkisini kontrol et
        const authority = user.authority;

        if (authority === 'admin') {
            return res.json({ success: true, redirect: 'admin.html', message: 'Admin olarak giriş yapıldı.' });
        } else if (authority === 'user') {
            return res.json({ success: true, redirect: null, message: 'Giriş başarılı!' });
        } else {
            return res.json({ success: false, message: 'Yetkisiz giriş.' });
        }

    } catch (error) {
        console.error('Giriş sırasında bir hata oluştu:', error);
        res.json({ success: false, message: 'Giriş sırasında bir hata oluştu.' });
    }
});


// Kayıt İşlemi
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('user');

        // Kullanıcı var mı kontrolü
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: "Bu e-posta ile kayıtlı bir kullanıcı zaten var!" });
        }

        // Şifreyi hashle
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tarih bilgileri
        const currentDate = new Date().toISOString();

        // Yeni kullanıcıyı oluştur
        const newUser = {
            email,
            username,
            password: hashedPassword, // Şifre yerine hashlenmiş şifre
            totalScore: 0,
            fireDay: 0,
            studiedTime: 0,
            createDate: { $date: currentDate },
            lastLoginDay: { $date: currentDate },
            studiedDays: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            },
            authority: "user",
        };

        // Kullanıcıyı koleksiyona ekle
        await collection.insertOne(newUser);


        res.status(201).send({ message: "Kayıt başarılı!" });
    } catch (err) {
        console.error("Kayıt hatası:", err.message);
        res.status(500).send({ message: "Bir hata oluştu.", error: err.message });
    }
});


//sesle çeviri
app.get('/tts', async (req, res) => {
    const text = req.query.text;
    const lang = req.query.lang;

    if (!text || !lang) {
        return res.status(400).send('Text and language parameters are required.');
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=gtx&q=${encodeURIComponent(text)}`;

    try {
        const response = await axios.get(ttsUrl, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' } // Google'ın TTS hizmetini tanıması için gerekli
        });
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': response.data.length
        });
        res.send(response.data);
    } catch (error) {
        console.error('TTS Proxy Hatası:', error.message);
        res.status(500).send('TTS hizmeti kullanılamıyor.');
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});
