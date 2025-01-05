require('dotenv').config();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const cors = require("cors");
const axios = require('axios');
const express = require("express");
const path = require("path");
const multer = require('multer');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images'); // Dosyaların kaydedileceği klasör
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname;
        const newFileName = uniqueSuffix + '-' + originalName;
        cb(null, newFileName);
    }
});

const upload = multer({ storage: storage });

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

app.get('/get-user-info', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "E-posta bilgisi gerekli." });
    }

    try {
        const usersCollection = await getCollection("user");
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }        

        // Kullanıcı bilgilerini döndür
        res.status(200).json({
            username: user.username,
            email: user.email,
            totalScore: user.totalScore,
            streak: user.streak,
            studiedTime: user.studiedTime,
            studiedDays: user.studiedDays,
        });
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

        // Kullanıcının bugünkü gün bilgisini al ve veritabanını güncelle
        const bugün = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();


        if (!user.studiedDays[bugün]) {
            // Güncelleme işlemi
            await usersCollection.updateOne(
                { email }, // Koşul
                { $set: { [`studiedDays.${bugün}`]: true } } // Güncelleme
            );
        }


        // Tarih kontrolleri
        const today = new Date();
        const lastLoginDay = new Date(user.lastLoginDay?.$date || user.lastLoginDay || 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        let updatedStreak = user.streak;
        if (lastLoginDay.toDateString() === today.toDateString()) {
            // Bugün giriş yapılmış, bir şey yapma
        } else if (lastLoginDay.toDateString() === yesterday.toDateString()) {
            // Dün giriş yapılmış, streak artır
            updatedStreak++;
        } else {
            // Daha önceki günler, streak sıfırla
            updatedStreak = 0;
        }

        // Güncellemeleri yap
        await usersCollection.updateOne(
            { email },
            {
                $set: {
                    lastLoginDay: { $date: today.toISOString() },
                    streak: updatedStreak,
                },
            }
        );

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


app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Girdi kontrolü
    if (!username || !email || !password) {
        return res.status(400).send({ message: "Kullanıcı adı, e-posta ve şifre alanları doldurulmalıdır." });
    }

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

        const today = new Date();
        const todayString = today.toISOString();
        const dayName = today.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

        // Yeni kullanıcıyı oluştur
        const newUser = {
            email,
            username,
            password: hashedPassword,
            totalScore: 0,
            streak: 0,
            studiedTime: 0,
            createDate: { $date: todayString },
            lastLoginDay: { $date: todayString },
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

        // Bugünkü günü true olarak işaretle
        newUser.studiedDays[dayName] = true;

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

//Çalışılan zamanı güncelleme
app.post("/update-studied-time", async (req, res) => {
    const { email, minutes } = req.body;

    if (!email || !minutes) {
        return res.status(400).json({ success: false, message: "Geçersiz veri!" });
    }

    try {
        const usersCollection = await getCollection("user");

        // Kullanıcıyı bul ve studiedTime'ı güncelle
        const result = await usersCollection.updateOne(
            { email },
            { $inc: { studiedTime: minutes } } // Dakikayı ekle
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
        }

        res.json({ success: true, message: "StudiedTime başarıyla güncellendi." });
    } catch (error) {
        console.error("StudiedTime güncelleme hatası:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
});


// Çeviri kaydetme endpoint'i
app.post('/save-translation', async (req, res) => {
    const { userEmail, sourceText, resultText, sourceLang, targetLang } = req.body;

    try {
        const collection = await getCollection('wordsTable');
        const languageKey = `${sourceLang}-${targetLang}`;

        // Kullanıcının mevcut dokümanını bul
        const userDocument = await collection.findOne({ email: userEmail });

        // Yeni kelime grubu
        const newTranslation = {
            source_text: sourceText,
            target_text: resultText,
            score: 0,
            nextScore: 5,
            isFavorite: false,
            difficulty: 'difficult',
            added_time: new Date(),
        };

        if (userDocument) {
            // Mevcut bir dil grubu kontrolü
            const translations = userDocument.translations || {};
            if (!translations[languageKey]) {
                translations[languageKey] = [];
            }

            // Aynı kelime grubunun eklenip eklenmediğini kontrol et
            const exists = translations[languageKey].some(
                (item) => item.source_text === sourceText && item.target_text === resultText
            );

            if (exists) {
                return res.status(400).json({ success: false, message: 'Bu çeviri zaten mevcut.' });
            }

            // Dil grubuna yeni çeviri ekle
            translations[languageKey].push(newTranslation);

            // Kullanıcı dokümanını güncelle
            await collection.updateOne(
                { email: userEmail },
                { $set: { translations } }
            );
        } else {
            // Yeni bir kullanıcı dokümanı oluştur
            const newUserDocument = {
                email: userEmail,
                translations: {
                    [languageKey]: [newTranslation],
                },
            };

            await collection.insertOne(newUserDocument);
        }

        res.json({ success: true, message: 'Çeviri başarıyla kaydedildi.' });
    } catch (error) {
        console.error('Çeviri kaydetme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
    }
});


// Çeviri silme endpoint'i
app.delete('/delete-translation', async (req, res) => {
    const { userEmail, sourceText, resultText, sourceLang, targetLang } = req.body;
    try {
        const collection = await getCollection('wordsTable');
        const langGroup = `${sourceLang}-${targetLang}`; // Belirtilen dil grubunu al

        // Kullanıcının dokümanını bul
        const userDoc = await collection.findOne({ email: userEmail });
        if (!userDoc || !userDoc.translations) {
            return res.status(404).json({
                success: false,
                message: 'Dil grubu bulunamadı.',
            });
        }

        const translations = userDoc.translations;

        // Yalnızca belirtilen dil grubunda çeviriyi sil
        let isDeleted = false;

        if (translations[langGroup]) {
            const updatedGroup = translations[langGroup].filter(
                (item) =>
                    item.source_text.toLowerCase() !== sourceText.toLowerCase() ||
                    item.target_text.toLowerCase() !== resultText.toLowerCase()
            );

            if (updatedGroup.length !== translations[langGroup].length) {
                translations[langGroup] = updatedGroup;
                if (translations[langGroup].length === 0) delete translations[langGroup];
                isDeleted = true;
            }
        }

        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek çeviri bulunamadı.',
            });
        }

        // Güncellemeyi kaydet
        await collection.updateOne(
            { email: userEmail },
            { $set: { translations } }
        );

        res.json({ success: true, message: 'Çeviri başarıyla silindi.' });
    } catch (error) {
        console.error('Çeviri silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu.',
        });
    }
});

// Çeviri kontrolü endpoint'i
app.post('/check-translation', async (req, res) => {
    const { userEmail, sourceText, resultText, sourceLang, targetLang } = req.body;

    try {
        const collection = await getCollection('wordsTable');
        const langGroup = `${sourceLang}-${targetLang}`;

        // Kullanıcının dokümanını bul
        const userDoc = await collection.findOne({ email: userEmail });
        if (!userDoc || !userDoc.translations) {
            return res.status(404).json({
                success: false,
                message: 'Dil grubu bulunamadı.',
            });
        }

        const translations = userDoc.translations;

        // Dil grubunda çeviri var mı kontrol et
        if (translations[langGroup]) {
            const exists = translations[langGroup].some(
                (item) => item.source_text === sourceText.toLowerCase() &&
                        item.target_text === resultText.toLowerCase()
            );

            if (exists) {
                return res.json({ success: true });
            }
        }

        // Eğer çeviri yoksa
        return res.json({ success: false });
    } catch (error) {
        console.error('Çeviri kontrol hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu.',
        });
    }
});


// Politika güncelleme API'si
app.post('/update-policy', async (req, res) => {
    const { page, backgroundColor, fontSize, color, content, imageName } = req.body;

    try {
        const collection = await getCollection('politikalar');
        await collection.updateOne(
            { page },
            { $set: { backgroundColor, fontSize, color, content, imageName } }
        );


        res.json({ success: true, message: 'Doküman başarıyla güncellendi!' });
    } catch (error) {
        console.error('Doküman güncellenirken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
    }
});

// Resim yükleme endpoint'i
app.post('/upload-image', upload.single('backgroundImage'), (req, res) => {
    const imageName = req.file.filename; // Yüklenen dosyanın adı
    res.json({ imageName }); // Resim adını JSON olarak döndür
});

// Sayfa verilerini getiren endpoint
app.get('/get-page-data/:page', async (req, res) => {
    const { page } = req.params;

    try {
        const collection = await getCollection('politikalar');
        const pageData = await collection.findOne({ page });

        if (pageData) {
            res.json(pageData);
        } else {
            res.status(404).json({ message: 'Sayfa bulunamadı.' });
        }
    } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

// Sayfa verilerini getiren endpoint
app.get('/get-policy-data/:page', async (req, res) => {
    const { page } = req.params;

    try {
        const collection = await getCollection('politikalar');
        const pageData = await collection.findOne({ page });

        if (pageData) {
            res.json(pageData);
        } else {
            res.status(404).json({ message: 'Sayfa bulunamadı.' });
        }
    } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

app.get('/get-languages/:type', async (req, res) => {
    const { type } = req.params;
    const collection = await getCollection('languageSelections');

    try {
        const languageData = await collection.findOne({ name: type === 'source' ? 'sourceLanguage' : 'targetLanguage' });

        if (languageData) {
            res.json(languageData.languages);
        } else {
            res.status(404).json({ message: 'Diller bulunamadı.' });
        }
    } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

app.post('/modify-languages/:type', async (req, res) => {
    const { type } = req.params;
    const { action, languageCode } = req.body;
    const collection = await getCollection('languageSelections');
    const documentName = type === 'source' ? 'sourceLanguage' : 'targetLanguage';

    try {
        const languageData = await collection.findOne({ name: documentName });

        if (!languageData) {
            return res.status(404).json({ message: 'Dil dokümanı bulunamadı.' });
        }

        const languages = languageData.languages;

        if (action === 'add') {
            if (!languages[languageCode]) {
                // Yeni dil ekle
                languages[languageCode] = getLanguageName(languageCode);
            }
        } else if (action === 'remove') {
            if (languages[languageCode]) {
                // Dili sil
                delete languages[languageCode];
            }
        }

        await collection.updateOne(
            { name: documentName },
            { $set: { languages } }
        );

        res.json(languages);
    } catch (error) {
        console.error('Dil güncellenirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

function getLanguageName(code) {
    const languageMap = {
        "auto": "Dili algıla",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "en": "English",
        "ja": "Japanese",
        "zh": "Chinese",
        "ru": "Russian",
        "ko": "Korean",
        "pt": "Portuguese",
        "ar": "Arabic",
        "sv": "Swedish",
        "nb": "Norwegian",
        "tr": "Türkçe",
        "vi": "Vietnamese"
    };
    return languageMap[code];
}

// Kullanıcı verilerini getiren endpoint
app.get('/get-users', async (req, res) => {
    try {
        const usersCollection = await getCollection('user');
        const users = await usersCollection.find({}, {
            projection: {
                email: 1,
                username: 1,
                totalScore: 1,
                streak: 1,
                studiedTime: 1,
                createDate: 1,
                lastLoginDay: 1,
                authority: 1
            }
        }).toArray();

        res.json(users);
    } catch (error) {
        console.error('Kullanıcı verileri alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

// Kullanıcı yetkisini güncelleyen endpoint
app.post('/update-user-authority', async (req, res) => {
    const { email, authority } = req.body;

    try {
        const usersCollection = await getCollection('user');
        const result = await usersCollection.updateOne(
            { email },
            { $set: { authority } }
        );

        if (result.modifiedCount > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Yetki güncellenemedi.' });
        }
    } catch (error) {
        console.error('Yetki güncellenirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

// Kullanıcıyı silen endpoint
app.delete('/delete-user', async (req, res) => {
    const { email } = req.body;

    try {
        const usersCollection = await getCollection('user');
        const result = await usersCollection.deleteOne({ email });

        if (result.deletedCount > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Kullanıcı silinemedi.' });
        }
    } catch (error) {
        console.error('Kullanıcı silinirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});
