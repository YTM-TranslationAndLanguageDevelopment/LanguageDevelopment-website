
// tabloyu bulma, yeni satır oluşturma ve tabloya ekleme. 
// Kullanıcı, sadece TableManager.addRow(tableId) çağrısını yaparak
//  bu işlemi gerçekleştirebilir,
//  içindeki karmaşık işlemleri bilmesine gerek yoktur.

// Flyweight Design Pattern: çpk nesne oluşturduk
class Word {
    constructor(text) {
        this.text = text;
    }
}

const WordFactory = (function () {
    const wordPool = {};
    return {
        getWord: function (text) {
            if (!wordPool[text]) {
                wordPool[text] = new Word(text);
            }
            return wordPool[text];
        }
    };
})();

// örnek kelimeler
const word1 = WordFactory.getWord("cold");
const word2 = WordFactory.getWord("cold");
console.log(word1 === word2); // True, same instance

// Facade Design Pattern: Centralized Table Manager
const TableManager = {
    addRow: function (tableId) {
        const table = document.getElementById(tableId);
        const newRow = table.insertRow();
        const count = table.rows.length; // Satır sayısını al
        
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        
        // Yeni satırdaki hücrelere varsayılan metin ekle
        cell1.textContent = `${count}. Yeni Kelime`;
        cell2.textContent = `${count}. Yeni Türkçe Anlam`;

        // Burada, kullanıcıdan gelen kelimeyi eklemek için bir prompt veya input alanı da kullanılabilir.
    }
};

// Her tabloya ait verileri ayrı ayrı array'lerde tutuyoruz
const sozlukKelimeleri = [
    { ingilizce: "cold", turkce: "soğuk" },
    { ingilizce: "weather", turkce: "hava" }
];

const onerilenKelimeler = [
    { ingilizce: "summer", turkce: "yaz" },
    { ingilizce: "winter", turkce: "kış" }
];

const hazirKelimeler = [
    { ingilizce: "rain", turkce: "yağmur" },
    { ingilizce: "cloudy", turkce: "bulutlu" },
    { ingilizce: "cloudy", turkce: "bulutlu" },
    { ingilizce: "cloudy", turkce: "bulutlu" },
    { ingilizce: "cloudy", turkce: "bulutlu" }

];

// Tabloyu dolduran fonksiyon
function tabloyuDoldur(tabloId, kelimeler) {
    const tablo = document.getElementById(tabloId);
    
    // Kelimeler array'ini döngü ile gezip tabloya ekliyoruz
    kelimeler.forEach(kelime => {
        const newRow = tablo.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        
        // Hücrelere İngilizce ve Türkçe kelimeleri yerleştiriyoruz
        cell1.textContent = kelime.ingilizce;
        cell2.textContent = kelime.turkce;
    });
}

// Sayfa yüklendiğinde tüm tabloları doldurmak için fonksiyonu çağırıyoruz
window.onload = function() {
    tabloyuDoldur("sozlukTable", sozlukKelimeleri);
    tabloyuDoldur("onerilenTable", onerilenKelimeler);
    tabloyuDoldur("hazirTable", hazirKelimeler);
};
