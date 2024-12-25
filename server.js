require('dotenv').config();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const cors = require("cors");
const axios = require('axios');
const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Ana sayfayı yönlendirme
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//Api bilgisi
const apiKey = process.env.WORDNIK_API_KEY

// MongoDB bağlantı bilgileri
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

//Koleksiyona bağlanma
async function getCollection(collectionName) {
    try {
        await client.connect();
        const db = client.db(dbName);
        return db.collection(collectionName);
    } catch (err) {
        console.error("Veritabanı bağlantı hatası:", err.message);
        throw new Error("Veritabanına bağlanılamadı.");
    }
}

// Kullanıcı ismini getirme - deneme için saved.html ve admin.html de kullanıldı sonradan silinebilir
app.get("/user", async (req, res) => {
    const { email } = req.query;

    try {
        const collection = await getCollection("user");
        const user = await collection.findOne({ email });
        if (user) {
            res.status(200).send({ username: user.username, email: user.email });
        } else {
            res.status(404).send({ message: "Kullanıcı bulunamadı." });
        }
    } catch (err) {
        console.error("Backend Hatası:", err.message);
        res.status(500).send({ message: "Bir hata oluştu.", error: err.message });
    }
});

// Kullanıcı ismini ve epostasını getirme - profil sayfası için ekstra veriler isteyip geliştirilecek
app.get('/get-user-info', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "E-posta bilgisi gerekli." });
    }

    try {
        const usersCollection = await getCollection("user");

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
        const usersCollection = await getCollection("user");

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
        } 
        else if (authority === 'user') {
            return res.json({ success: true, redirect: null, message: 'Giriş başarılı!' });
        }
        else {
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
        const collection = await getCollection("user");

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

app.get('/random-word', async (req, res) => {
    const url = `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.word) {
            res.status(200).json({ word: response.data.word }); // Rastgele kelimeyi döndür
        } else {
            res.status(404).json({ error: 'Rastgele kelime alınamadı.' });
        }
    } catch (error) {
        console.error('Wordnik API Hatası:', error.message);
        res.status(500).json({ error: 'Wordnik API çağrısında hata oluştu.' });
    }
});

app.get('/wordnik-dictionary', async (req, res) => {
    const { word } = req.query;

    if (!word) {
        return res.status(400).send({ error: "Kelime gerekli." });
    }

    const apiKey = process.env.WORDNIK_API_KEY; // .env dosyasından API anahtarını alın
    const url = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const wordType = response.data[0].partOfSpeech || "Type not found"; // Kelimenin türünü al
            res.status(200).json({ type: wordType });
        } else {
            res.status(404).json({ error: "Kelime bulunamadı." });
        }
    } catch (error) {
        console.error("Wordnik API hatası:", error.message);
        res.status(500).json({ error: "Wordnik API çağrısında hata oluştu." });
    }
});


// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});
