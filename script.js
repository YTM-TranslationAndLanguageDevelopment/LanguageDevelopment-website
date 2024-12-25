let islogin = ""; //giriş-kayıt yaparsa epostası tutulacak

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

//yan menüyü açma 
function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
    document.getElementById("sideMenu").style.display="block";
    document.querySelector(".menu-toggle").style.display = "none"; // Açma butonunu gizle
    document.querySelector(".politikalar").style.display = "grid"; 
    document.querySelector(".social-icons").style.display = "grid";
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle.classList.add("hidden"); // Açma butonunu gizle
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
    }, 600);
}
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

function translateText(sourceText, sourceLang, targetLang, callback) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;

    $.getJSON(url, function (data) {
        const translatedText = data[0][0][0];
        callback(translatedText); // Çevrilen metni geri döndür
    }).fail(function () {
        callback(null); // Çeviri başarısız olursa null döndür
    });
}

// Dillerin ve metinlerin yer değiştirilmesi
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
        console.log($('#sourceLanguage').val()); // Yeni source dilini yazdır

        translate(); // Çeviriyi yeniden başlat
    }
});



// Silme butonuna tıklama işlevi
$('.delete-icon').click(function () {
    $('#sourceText').val(''); // Kaynak metni temizle
    $('#resultText').val(''); // Çeviri metnini temizle
    adjustHeight();
    closeRecognizing();
    resetStarIcon();
});

function closeRecognizing() {
    if (recognizing) {
        recognition.stop(); // Ses tanımayı durdur
        recognizing = false;
        toggleMicrophoneState(false); // Mikrofonu sıfırla
    }
}


// Ses tanıma API'sini başlat
let recognition;
let recognizing = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Sürekli dinleme
    recognition.interimResults = true; // Geçici sonuçları göster
    recognition.lang = document.getElementById("sourceLanguage").value; // Varsayılan dil

    recognition.onstart = () => {
        console.log($('#sourceLanguage').val() + " " + recognition.lang);
        console.log('Ses tanıma başladı.');
    };

    recognition.onerror = (event) => {
        console.error('Hata oluştu:', event.error);
    };

    recognition.onend = () => {
        console.log('Ses tanıma durduruldu.');
        recognizing = false;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalText += event.results[i][0].transcript+'.'; // Tamamlanmış metni ekle
            } else {
                interimTranscript += event.results[i][0].transcript+'.'; // Geçici metni al
            }
        }

        // Mevcut metni güncelle
        const currentText = $('#sourceText').val();
        const newText = currentText + finalText;
        $('#sourceText').val(newText);

        translate();
    };
} else {
    alert('Tarayıcınız ses tanımayı desteklemiyor.');
}

// Mikrofon simgesine tıklandığında başlat/durdur
$('#microfon').on('click', () => {
    if (recognizing) {
        recognition.stop(); // Ses tanımayı durdur
        recognizing = false;
        toggleMicrophoneState(false); // Mikrofonu kapalı duruma geç
    } else {
        recognition.lang = document.getElementById("sourceLanguage").value; // Dil ayarını yap
        recognition.start(); // Ses tanımayı başlat
        recognizing = true;
        toggleMicrophoneState(true); // Mikrofonu açık duruma geç
    }
});

// Dil değişikliği işlevi
function handleLanguageChange() {
    translate();
    console.log('dil değişti');
    closeRecognizing();

    const selectedLanguage = document.getElementById("sourceLanguage").value;
    recognition.lang = selectedLanguage; // Yeni dili ayarla
    console.log(`Dil ayarlandı: ${selectedLanguage}`);
}

function closeRecognizing() {
    if (recognizing) {
        recognition.stop(); // Ses tanımayı durdur
        recognizing = false;
        toggleMicrophoneState(false); // Mikrofonu sıfırla
    }
}

function toggleMicrophoneState(isListening) {
    const microphoneIcon = $('#microfon'); // Mikrofon simgesini doğrudan id ile seç

    if (isListening) {
        microphoneIcon.attr('src', 'images/stopmicrofon.png'); // Mikrofon simgesini "dinleme" durumuna değiştir
        $('.star-icon, .icon-row2').hide(); // Yıldız ve icon-row2 sınıflarını gizle
        $('.icon-row1').children().not(microphoneIcon).hide(); // icon-row1 içindeki mikrofon dışında kalanları gizle
    } else {
        microphoneIcon.attr('src', 'images/microfon.png'); // Mikrofon simgesini eski haline döndür
        $('.star-icon, .icon-row2').show(); // Yıldız ve icon-row2 sınıflarını göster
        $('.icon-row1').children().show(); // icon-row1 içindeki öğeleri geri getir
    }
}

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

// Yıldız simgesini değiştirme fonksiyonu
function resetStarIcon() {
    const starIcon = $('.star-icon');
    if (starIcon.attr('src') === 'images/doluyıldız.png') {
        starIcon.attr('src', 'images/bosyıldız.png'); // Bosyıldız.png'ye döndür
    }
}

// Yıldız simgesi tıklama olayları
$('.star-icon').click(function () {
    const starIcon = $(this);
    if (starIcon.attr('src') === 'images/bosyıldız.png') {
        starIcon.attr('src', 'images/doluyıldız.png'); // Doluyıldız.png yap
    } else {
        starIcon.attr('src', 'images/bosyıldız.png'); // Bosyıldız.png yap
    }
});



// ComboBox değiştirildiğinde yıldız sıfırla
$('#sourceLanguage, #targetLanguage').change(function () {
    resetStarIcon();
    closeRecognizing(); // Ses tanımayı durdur
    toggleMicrophoneState(false);
});


// Yazı alanına yeni metin girildiğinde
$('#sourceText').on('input', function () {
    translate();
    resetStarIcon();
});

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
    islogin=""; //Kullanıcı çıkış yaptı
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





