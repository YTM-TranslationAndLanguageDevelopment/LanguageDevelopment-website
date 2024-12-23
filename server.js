const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
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
const collectionName = "user";

app.use(cors());
app.use(bodyParser.json());

// Kullanıcı ismini getirme
app.get("/user", async (req, res) => {
    const { email } = req.query;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

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




// Giriş İşlemi
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ email, password });
        if (user) {
            res.status(200).send({ message: "Giriş başarılı!" });
        } else {
            res.status(401).send({ message: "Geçersiz e-posta veya şifre!" });
        }
    } catch (err) {
        res.status(500).send({ message: "Bir hata oluştu.", error: err.message });
    }
});

// Kayıt İşlemi
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            res.status(409).send({ message: "Bu e-posta ile kayıtlı bir kullanıcı zaten var!" });
        } else {
            await collection.insertOne({ name, email, password });
            res.status(201).send({ message: "Kayıt başarılı!" });
        }
    } catch (err) {
        res.status(500).send({ message: "Bir hata oluştu.", error: err.message });
    }
});

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
