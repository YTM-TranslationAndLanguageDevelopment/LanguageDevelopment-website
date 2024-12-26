document.addEventListener("DOMContentLoaded", () => { //DOMContentLoaded
    // localStorage'daki tüm bilgileri belli bir zamandan sonra temizle diye değiştirilecek
    localStorage.clear();
});

function adjustHeight() {
    const sourceTextarea = document.getElementById('sourceText');
    const resultTextarea = document.getElementById('resultText');

    // Yüksekliği sıfırla ve yeniden hesapla
    sourceTextarea.style.height = 'auto';
    resultTextarea.style.height = 'auto';

    let maxHeight = Math.max(sourceTextarea.scrollHeight, resultTextarea.scrollHeight);
    maxHeight = Math.max(maxHeight, 200);
    sourceTextarea.style.height = resultTextarea.style.height = maxHeight + 'px';

    // Sayfanın en altına kaydır
    window.scrollTo(0, document.body.scrollHeight);

    // Sayfa yüklendiğinde mevcut içeriğe göre yüksekliği ayarla
    document.addEventListener('DOMContentLoaded', adjustHeight);    
}
// metin girişi olduğunda yüksekliği ayarla
document.getElementById('sourceText').addEventListener('input', adjustHeight);
document.getElementById('resultText').addEventListener('input', adjustHeight);

function translate() {
    const sourceText = $('#sourceText').val();
    const sourceLang = $('#sourceLanguage').val();
    const targetLang = $('#targetLanguage').val();

    if (!sourceText.trim()) {
        $('#resultText').val('');
        return;
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
    
    $.getJSON(url, function (data) {
        $('#resultText').val(data[0][0][0]);
    }).fail(function () {
        $('#resultText').val('Çeviri yapılamadı.');
    });
}

function translateText(sourceText, sourceLang, targetLang, callback) { //Çeviri sonucunu döndürür
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;

    $.getJSON(url, function (data) {
        const translatedText = data[0][0][0];
        callback(translatedText); // Çevrilen metni geri döndür
    }).fail(function () {
        callback(null); // Çeviri başarısız olursa null döndür
    });
}

// Dil değiştirme ikonuna tıklanıp dillerin ve metinlerin yer değiştirilmesi
$('#swapLanguages').click(function () {
    // sourceLanguage değeri "auto" değilse işlemleri gerçekleştir
    const sourceLang = $('#sourceLanguage').val();
    const targetLang = $('#targetLanguage').val();

    if (sourceLang !== 'auto') {
        closeRecognizing();  // (Varsayılan olarak tanımlı bir fonksiyon olmalı)
        resetStarIcon();     // (Varsayılan olarak tanımlı bir fonksiyon olmalı)

        // Dilleri değiştir
        $('#sourceLanguage').val(targetLang);
        $('#targetLanguage').val(sourceLang);

        // Çeviriyi yeniden başlat
        $('#sourceText').val($('#resultText').val());

        translate(); // Çeviriyi yeniden başlat
    }
});

// Çeviri sonucunu panoya kopyala
$('#copy').click(function () {
    const resultText = $('#resultText').val();
    if (resultText.trim()) {
        navigator.clipboard.writeText(resultText).then(() => {
        }).catch(() => {
            alert('Panoya kopyalama başarısız oldu.');
        });
    } else {
        alert('Kopyalanacak metin bulunamadı.');
    }
});


// ComboBox tıklanıp değeri değiştirildiğinde
$('#sourceLanguage, #targetLanguage').change(function () {
    resetStarIcon();
    closeRecognizing(); 
    translate();

    const selectedLanguage = document.getElementById("sourceLanguage").value;
    recognition.lang = selectedLanguage; // Yeni dili ayarla
    console.log('dil değişti: '+selectedLanguage);
});


// Silme butonuna tıklama işlevi
$('.delete-icon').click(function () {
    $('#sourceText').val(''); // Kaynak metni temizle
    $('#resultText').val(''); // Çeviri metnini temizle
    adjustHeight();
    toggleElementsVisibility();
    resetStarIcon();
});

// Ses tanıma API'sini başlat
let recognition;
let recognizing = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Sürekli dinleme
    recognition.interimResults = true; // Geçici sonuçları göster
    recognition.lang = document.getElementById("sourceLanguage").value; // Varsayılan dil

    recognition.onstart = () => {
        $('#sourceText').val("");
        $('#resultText').val("");
        console.log('Ses tanıma başladı.');
    };

    recognition.onerror = (event) => {
        console.error('Hata oluştu:', event.error);
        closeRecognizing();
    };

    recognition.onend = () => {
        console.log('Ses tanıma durduruldu.');
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                let text = event.results[i][0].transcript.trim(); // Metni alın
                text = text.charAt(0).toUpperCase() + text.slice(1); // İlk harfi büyük yap
                finalText += text + '. '; // Nokta ekle
            } else {
                let text = event.results[i][0].transcript.trim(); // Geçici metni alın
                text = text.charAt(0).toUpperCase() + text.slice(1); // İlk harfi büyük yap
                interimTranscript += text + '. '; // Nokta ekle
            }
        }

        // Mevcut metni güncelle
        const currentText = $('#sourceText').val();
        const newText = currentText + finalText;
        $('#sourceText').val(newText);

        translate();
    };
} else {
    closeRecognizing();
    alert('Tarayıcınız ses tanımayı desteklemiyor.');
}

// Mikrofon simgesine tıklandığında başlat/durdur
$('#microfon').on('click', () => {
    if (recognizing) {
        closeRecognizing();
    } else {
        recognition.lang = document.getElementById("sourceLanguage").value; // Dil ayarını yap
        recognition.start(); // Ses tanımayı başlat
        recognizing = true;
        $('#sourceText').val("");
        toggleMicrophoneState(true); // Mikrofonu açık duruma geç
    }
});


function closeRecognizing() {
    if (recognizing) {
        recognition.stop(); // Ses tanımayı durdur
        recognizing = false;
        toggleMicrophoneState(false); // Mikrofonu sıfırla
    }
}

function toggleMicrophoneState(isListening) {
    const microphoneIcon = $('#microfon'); // Mikrofon simgesini doğrudan id ile seç
    const random = document.getElementById("random");

    toggleElementsVisibility();

    if (isListening) {
        microphoneIcon.attr('src', 'images/stopmicrofon.png'); // Mikrofon simgesini "dinleme" durumuna değiştir
        random.style.display = "none";
    } else {
        microphoneIcon.attr('src', 'images/microfon.png'); // Mikrofon simgesini eski haline döndür
    }
}



// sourceText'i seslendir (Google Translate TTS)
$('#volume1').click(function () {
    const text = $('#sourceText').val();
    if (text.trim()) {
        playTTS(text, $('#sourceLanguage').val());
    } else {
        alert('Seslendirilecek bir metin bulunamadı.');
    }
});

// resultText'i seslendir (Google Translate TTS)
$('#volume2').click(function () {
    const text = $('#resultText').val();
    if (text.trim()) {
        playTTS(text, $('#targetLanguage').val());
    } else {
        alert('Seslendirilecek bir metin bulunamadı.');
    }
});

function playTTS(text, lang) {
    // Backend üzerindeki /tts endpointine istek göndermek için URL oluştur
    const ttsUrl = `http://localhost:3000/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
    
    // Audio nesnesi oluştur ve sesi çal
    const audio = new Audio(ttsUrl);
    audio.play().catch((error) => {
        console.error("Ses oynatırken hata oluştu:", error);
        alert("Seslendirme başlatılamadı.");
    });
}

//Random kelime getirme
document.getElementById("random").addEventListener("click", () => {
    const sourceTextarea = document.getElementById("sourceText");
    const targetLang = document.getElementById("sourceLanguage").value; // Hedef dil

    // Rastgele kelime almak için fetch isteği
    fetch("/random-word")
        .then((response) => response.json())
        .then((data) => {
            if (data && data.word) {
                const word = data.word; // Rastgele kelime
                // İngilizce kelimeyi seçili hedef dile çevir
                translateText(word, "en", targetLang, (translatedText) => {
                    if (translatedText) {
                        sourceTextarea.value = ""; // Kaynak metni temizle
                        sourceTextarea.value = translatedText; // Çevrilen metni sourceText alanına yaz
                        toggleElementsVisibility();
                        translate();
                    } else {
                        alert("Çeviri yapılamadı.");
                    }
                });
            } else {
                alert("Rastgele kelime alınamadı.");
            }
        })
        .catch((error) => {
            console.error("Rastgele kelime alınırken hata oluştu:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        });
});

document.getElementById("dictionary").addEventListener("click", () => {
    if(toggleDictionaryTextVisibility()){ //dictionaryText görünür, kelime türü belli ise
        return;
    }
    const sourceTextarea = document.getElementById("sourceText");
    const dictionaryText = document.getElementById("dictionaryText"); // Sonuçları yazdıracağımız <p> elemanı
    const sourceLang = document.getElementById("sourceLanguage").value; // Girilen metnin dili

    let word = sourceTextarea.value.trim().toLowerCase(); // Metni trimle ve küçük harfe dönüştür
    dictionaryText.textContent = ""; // Önceki sonuçları temizle

    // Kelime geçerli mi kontrol et (boşluk, enter, noktalama işaretleri ve sayılar olmamalı)
    if (/[\s\d.,;:'"!?(){}[\]-]/.test(word)) {
        alert("Lütfen geçerli bir kelime girin.");
        return;
    }

    // İngilizce değilse önce İngilizceye çevir
    const processWord = (translatedWord) => {
        fetch(`/wordnik-dictionary?word=${encodeURIComponent(translatedWord)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.type) {
                    console.log(data.type);
                    // Kelime türünü İngilizce'den Türkçe'ye çevir
                    translateText(data.type, "en", "tr", (translatedType) => {
                        if (translatedType) {
                            dictionaryText.textContent = `Kelimenin türü: ${translatedType}`;
                        } else {
                            dictionaryText.textContent = "Kelimenin türü alınamadı.";
                        }
                    });
                } else {
                    dictionaryText.textContent = "Kelimenin türü alınamadı.";
                }
            })
            .catch((error) => {
                console.error("Wordnik API hatası:", error);
                dictionaryText.textContent = "Kelimenin türü alınamadı.";
            });
    };

    if (sourceLang !== "en") {
        translateText(word, sourceLang, "en", (translatedText) => {
            if (translatedText) {
                processWord(translatedText); // Çeviri başarılıysa türünü sorgula
            } else {
                alert("Kelimenin çevirisi yapılamadı.");
            }
        });
    } else {
        processWord(word); // İngilizce ise direkt türünü sorgula
    }
});


// DictionaryText görünürlüğünü kontrol eden yardımcı fonksiyon
function toggleDictionaryTextVisibility() {
    const dictionaryText = document.getElementById("dictionaryText");

    if (dictionaryText.style.display === "none" || dictionaryText.style.display === "") {
        dictionaryText.style.display = "block"; // Görünürlüğü aç
        return false;
    } else {
        dictionaryText.style.display = "none"; // Görünürlüğü kapat
        return true;
    }
}

// DictionaryText ögesini kapatan fonksiyon
function hideDictionaryText() {
    const dictionaryText = document.getElementById("dictionaryText");
    dictionaryText.style.display = "none"; // Görünürlüğü kapat
}


// Belirtilen ögelere tıklanınca dictionaryText görünürlüğünü kapat
["microfon", "delete-icon"].forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
        element.addEventListener("click", () => {
            hideDictionaryText();
        });
    }
});


// Yıldız simgesi tıklama olayları
$('.star-icon').click(function () {
    const starIcon = $(this);
    if (starIcon.attr('src') === 'images/bosyıldız.png') {
        starIcon.attr('src', 'images/doluyıldız.png'); // Doluyıldız.png yap
    } else {
        starIcon.attr('src', 'images/bosyıldız.png'); // Bosyıldız.png yap
    }
});

// Yıldız simgesini değiştirme fonksiyonu
function resetStarIcon() {
    const starIcon = $('.star-icon');
    if (starIcon.attr('src') === 'images/doluyıldız.png') {
        starIcon.attr('src', 'images/bosyıldız.png'); // Bosyıldız.png'ye döndür
    }
}


function toggleElementsVisibility() {
    const sourceText = document.getElementById("sourceText").value.trim(); // sourceText içindeki metni al
    const elementsToShow = document.querySelectorAll(".volume, .star-icon, #dictionary, #copy, #derecele, #share, #delete-icon");
    const randomElement = document.getElementById("random");

    if (sourceText) {
        // Metin varsa belirli ögeleri göster
        elementsToShow.forEach((element) => {
            element.style.display = "block"; // Görünür yap
        });
        randomElement.style.display = "none"; // Rastgele kelime ögesini gizle
    } else {
        // Metin yoksa tam tersi
        elementsToShow.forEach((element) => {
            element.style.display = "none"; // Gizle
        });
        randomElement.style.display = "block"; // Rastgele kelime ögesini göster
    }
}

let debounceTimeout;  //  Kaynak metin değiştiğinde
document.getElementById("sourceText").addEventListener("input", () => {
    hideDictionaryText();
    toggleElementsVisibility();
    closeRecognizing();

    clearTimeout(debounceTimeout); // Önceki timeout'u temizle
    debounceTimeout = setTimeout(() => {
        const sourceTextValue = document.getElementById("sourceText").value;
        if (sourceTextValue === "") {console.log('aa');
            document.getElementById("resultText").value = ""; // value ile içeriği temizle
        } else {
            translate(); // Çeviri işlemini sadece bir süre sonra yap
        }
    }, 150); // 150ms sonra işlemi yap
    resetStarIcon();
});


//yan menüyü açma 
function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
    document.getElementById("sideMenu").style.display="block";
    document.querySelector(".menu-toggle").style.display = "none"; // Açma butonunu gizle
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle.classList.add("hidden"); // Açma butonunu gizle
    document.querySelector(".politikalar").style.display = "grid"; 
    document.querySelector(".social-icons").style.display = "grid";
}
//yan menüyü kapatma
function closeMenu() {
    document.getElementById("sideMenu").style.width = "0";
    document.querySelector(".menu-toggle").style.display = "block"; // Açma butonunu göster
    document.querySelector(".politikalar").style.display = "none"; //fecade tasarım
    document.querySelector(".social-icons").style.display = "none"; //ekran kapanırken bloklaşma gösterilmiyor
    setTimeout(() => {
        const menuToggle = document.querySelector(".menu-toggle");
        menuToggle.classList.remove("hidden"); // Açma butonunu yavaşça göster
    }, 300);
}

function openPopup(id) {
    document.getElementById(id).style.display = 'flex';

    // Metin kutularını temizle
    if (id === 'girisPopup') {
        document.getElementById("email").value = ""; // Giriş için eposta
        document.getElementById("password").value = ""; // Giriş için şifre
    } else if (id === 'kayitPopup') {
        document.getElementById("newUsername").value = ""; // Kayıt için kullanıcı adı
        document.getElementById("newEmail").value = ""; // Kayıt için eposta
        document.getElementById("newPassword").value = ""; // Kayıt için şifre
    }else if (id === 'profilPopup') {
        document.getElementById("profilUserName").value = ""; // Profil için kullanıcı adı
        document.getElementById("profilEmail").value = ""; // Profil için eposta
        profilbilgileriayarla();
    }
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
}
/* Kullanıcı hesaptan çıkışı */
document.getElementById('exitProfil').addEventListener('click', (event) => {
    event.preventDefault(); // Link varsayılan davranışını engelle
    closePopup('profilPopup'); // Popup'ı kapat
    setVisibility(false); // Kullanıcı çıkış yaptı, görünürlük ayarla
});

document.getElementById("savedIcon").addEventListener("click", () => {
    window.location.href = "saved.html";
});

/* Giriş yapılınca butonları ayarlama */
function setVisibility(isLoggedIn) {
    const profilButton = document.getElementById('profilbutton');
    const settingsButton = document.getElementById('settingsbutton');
    const loginButton = document.getElementById('loginbutton');
    const registerButton = document.getElementById('registerbutton');

    if (isLoggedIn) {
        profilButton.style.display = 'inline-block'; // Profil butonu görünür
        settingsButton.style.display = 'inline-block'; // Ayarlar butonu görünür
        loginButton.style.display = 'none'; // Giriş butonu gizli
        registerButton.style.display = 'none'; // Kayıt ol butonu gizli
    } else {
        profilButton.style.display = 'none'; // Profil butonu gizli
        settingsButton.style.display = 'none'; // Ayarlar butonu görünür
        loginButton.style.display = 'inline-block'; // Giriş butonu görünür
        registerButton.style.display = 'inline-block'; // Kayıt ol butonu görünür
    }
}





