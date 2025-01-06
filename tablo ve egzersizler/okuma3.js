// Sözlük verileri
const dictionary = {
    "blue": "mavi",
    "is": "olmak",
    "the": "belirli tanımlık",
    "color": "renk",
    "of": " -nin, -nın",
    "sky": "gökyüzü",
    "apple": "elma",
    "a": "bir",
    "type": "tür",
    "fruit": "meyve",
    "example": "örnek",
    "sentence": "cümle",
    "big": "büyük",
    "trees": "ağaçlar",
    "grow": "büyümek",
    "in": "içinde",
    "forests": "ormanlar",
    "beautiful": "güzel",
    "flowers": "çiçekler",
    "bloom": "açmak",
    "spring": "bahar",
    "fast": "hızlı",
    "cars": "arabalar",
    "are": "vardır, olmak",
    "expensive": "pahalı",
    "complex": "karmaşık",
    "systems": "sistemler",
    "require": "gerektirmek",
    "detailed": "detaylı",
    "understanding": "anlayış",
    "argue": "tartışmak",
    "with": "ile",
    "others": "diğerleri",
    "to": "e, -a, için",
    "improve": "geliştirmek",
    "critical": "kritik",
    "thinking": "düşünme",
    "success": "başarı",
    "comes": "gelir",
    "hard": "zor",
    "work": "çalışma",
    "and": "ve",
    "perseverance": "azim",
    "tom": "Tom (isim)",
    "has": "sahip",
    "small": "küçük",
    "dog": "köpek",
    "likes": "sever",
    "run": "koşmak",
    "play": "oynamak",
    "park": "park",
    "every": "her",
    "morning": "sabah",
    "takes": "götürür",
    "walk": "yürüyüş",
    "they": "onlar",
    "have": "sahip olmak",
    "fun": "eğlence",
    "together": "birlikte",
    "autumn": "sonbahar",
    "leaves": "yapraklar",
    "trees": "ağaçlar",
    "change": "değişmek",
    "turn": "dönmek",
    "red": "kırmızı",
    "yellow": "sarı",
    "brown": "kahverengi",
    "before": "önce",
    "falling": "düşmek",
    "ground": "yer",
    "cool": "serin",
    "wind": "rüzgar",
    "blows": "eser",
    "people": "insanlar",
    "enjoy": "hoşlanmak",
    "walking": "yürüyüş yapmak",
    "fresh": "temiz",
    "air": "hava",
    "advancements": "ilerlemeler",
    "technology": "teknoloji",
    "have": "sahip olmak",
    "transformed": "dönüştürdü",
    "way": "yol, şekil",
    "we": "biz",
    "live": "yaşamak",
    "work": "çalışmak",
    "from": "-den, -dan",
    "communication": "iletişim",
    "transportation": "ulaşım",
    "innovative": "yenilikçi",
    "ideas": "fikirler",
    "continue": "devam etmek",
    "shape": "şekillendirmek",
    "more": "daha",
    "efficient": "verimli",
    "connected": "bağlantılı",
    "world": "dünya",
    "however": "ancak",
    "these": "bunlar",
    "changes": "değişiklikler",
    "also": "ayrıca",
    "bring": "getirmek",
    "new": "yeni",
    "challenges": "zorluklar"
};

// Dinamik olarak yüklenecek metinler
const texts = {
    beginner: [  
        "Tom has a small dog. The dog likes to run and play in the park. Every morning, Tom takes his dog for a walk. They have fun together.",
        "Blue is the color of the sky.",
        "Apple is a type of fruit."
    ],
    intermediate: [
        "In autumn, the leaves on the trees change color. They turn red, yellow, and brown before falling to the ground. The cool wind blows, and people enjoy walking in the fresh air.",
        "Beautiful flowers bloom in the spring.",
        "Fast cars are expensive."
    ],
    advanced: [
        "Advancements in technology have transformed the way we live and work. From communication to transportation, innovative ideas continue to shape a more efficient and connected world. However, these changes also bring new challenges.",
        "Argue with others to improve critical thinking.",
        "Success comes with hard work and perseverance."
    ]
};

//STRATEGY DESEN
//KULLANICI SEVİYESİNE GÖRE UYGUN STRATEJİ BELİRLERİZ
// Seçilen metni dinamik olarak yükleme
function loadText(level, index) {
    const textContainer = document.getElementById("text-container");
    textContainer.innerHTML = processText(texts[level][index]); // Metni işleyip yükleyelim
    document.getElementById("levels").style.display = "none"; // Seviye kutularını gizle
    document.getElementById("controls").style.display = "block"; // Geri dön butonunu göster

    // Kelimelere tıklama işlevi ekleme
    addClickEventToWords();
}

// Geri dönme işlevselliği
function goBack() {
    document.getElementById("text-container").innerHTML = "";
    document.getElementById("levels").style.display = "flex"; // Seviye kutularını yeniden göster
    document.getElementById("controls").style.display = "none"; // Geri dön butonunu gizle
}

//OBSERVER,COMMAND(KOMUT) DESEN
// Kelime tıklama işlevselliği
function addClickEventToWords() {
    document.querySelectorAll(".word").forEach(wordElement => {
        wordElement.addEventListener("click", () => {
            const word = wordElement.textContent.toLowerCase();
            const meaning = wordElement.getAttribute('data-meaning') || "Anlam bulunamadı";
            
            // Anlam kutusunu güncelle ve göster
            const meaningBox = document.getElementById("meaning-box");
            meaningBox.textContent = `${word}: ${meaning}`;
            meaningBox.classList.add("visible");
            
            // 3 saniye sonra kutuyu gizle
            setTimeout(() => {
                meaningBox.classList.remove("visible");
            }, 3000);
        });
    });
}
//FACTORY FABRİKA, DECORATOR DESENİ
//metni dinamik olarak işler ve çıktı üretir.
//nesnelerin nasıl oluşturulduğuna dair bilgi sahibi olmasını engelleR
// Metin içindeki kelimeleri otomatik olarak span ile sarmalama
//DECRAOTOR İLE kelime tıklanaılabilir yapılıyor
function processText(text) {
    // Metindeki her kelimeyi kontrol et
    const words = text.split(' '); // Metni kelimelere ayır
    const processedWords = words.map(word => {
        // Kelimenin sözlükte olup olmadığını kontrol et
        const cleanedWord = word.replace(/[.,!?]/g, '').toLowerCase(); // Noktalama işaretlerini temizle
        if (dictionary[cleanedWord]) {
            // Kelime sözlükte varsa, span ile sar
            return `<span class="word" data-meaning="${dictionary[cleanedWord]}">${word}</span>`;
        }
        return word; // Sözlükte yoksa, kelimeyi olduğu gibi bırak
    });
    return processedWords.join(' '); // Kelimeleri tekrar birleştir
}

// İlk başta kelimelere tıklama işlevi ekle
addClickEventToWords();
//--------------------------------------------------------------
// Tamamlandı butonuna işlev ekleme
document.getElementById("btn-mark-complete").addEventListener("click", () => {
    // Tamamlandı mesajını göster
    const completionStatus = document.getElementById("completion-status");
    completionStatus.textContent = "✅ Bu metin tamamlandı!";
    completionStatus.classList.add("visible");

    // 5 saniye sonra mesajı tekrar gizle
    setTimeout(() => {
        completionStatus.classList.remove("visible");
    }, 5000);
});
