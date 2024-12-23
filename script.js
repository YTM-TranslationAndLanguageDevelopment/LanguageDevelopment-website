
function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
    document.getElementById("sideMenu").style.display="block";
    document.querySelector(".menu-toggle").style.display = "none"; // Açma butonunu gizle
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle.classList.add("hidden"); // Açma butonunu gizle
}

function closeMenu() {
    document.getElementById("sideMenu").style.width = "0";
    document.querySelector(".menu-toggle").style.display = "block"; // Açma butonunu göster
    setTimeout(() => {
        const menuToggle = document.querySelector(".menu-toggle");
        menuToggle.classList.remove("hidden"); // Açma butonunu yavaşça göster
    }, 600);
}

document.addEventListener("DOMContentLoaded", () => {
    // localStorage'daki tüm bilgileri temizle
    localStorage.clear();
});

// Dillerin ve metinlerin yer değiştirilmesi
$('#swapLanguages').click(function () {
    closeRecognizing();
    resetStarIcon();
    const sourceLang = $('#sourceLanguage').val();
    const targetLang = $('#targetLanguage').val();

    // Dilleri değiştir
    $('#sourceLanguage').val(targetLang);
    $('#targetLanguage').val(sourceLang);

    // Çeviriyi yeniden başlat
    $('#sourceText').val($('#resultText').val());
    console.log($('#sourceLanguage').val());
    translate();
});

// Çeviri işlemi
$('#sourceText').on('input', function () {
    translate();
});

// Silme butonuna tıklama işlevi
$('.delete-icon').click(function () {
    $('#sourceText').val(''); // Kaynak metni temizle
    $('#resultText').val(''); // Çeviri metnini temizle
    closeRecognizing();
});

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
                finalText += event.results[i][0].transcript; // Tamamlanmış metni ekle
            } else {
                interimTranscript += event.results[i][0].transcript; // Geçici metni al
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
$('#sourceContainer .icon-row1 img[src="images/microfon.png"]').on('click', () => {
    if (recognizing) {
        recognition.stop(); // Ses tanımayı durdur
    } else {
        recognition.lang = document.getElementById("sourceLanguage").value;
        recognition.start(); // Ses tanımayı başlat
        recognizing = true;
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

function closeRecognizing(){
    if (recognizing) { //ses tanıma açıksa
        recognition.stop(); // Ses tanımayı durdur
        recognizing = false;
        return true;
    }
    return false;
}

// Çeviri sonucunu panoya kopyala
$('#resultContainer .icon-row2 img[src="images/paste1.png"]').click(function () {
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
$('#sourceContainer .icon-row1 img[src="images/volume.png"]').click(function () {
    const text = $('#sourceText').val();
    if (text.trim()) {
        playTTS(text, $('#sourceLanguage').val());
    } else {
        alert('Seslendirilecek bir metin bulunamadı.');
    }
});

// resultText'i seslendir (Google Translate TTS)
$('#resultContainer .icon-row2 img[src="images/volume.png"]').click(function () {
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

// Mikrofon simgesi tıklama olayları
$('.microfon').click(function () {
    const starIcon = $(this);
    if (starIcon.attr('src') === 'images/microfon.png') {
        starIcon.attr('src', 'images/stopmicrofon.png');
    } else {
        starIcon.attr('src', 'images/microfon.png'); 
    }
});

// ComboBox değiştirildiğinde yıldız sıfırla
$('#sourceLanguage, #targetLanguage').change(function () {
    resetStarIcon();
});

// Silme butonuna tıklanınca yıldız sıfırla
$('.delete-icon').click(function () {
    resetStarIcon();
});

// Yazı alanına yeni metin girildiğinde yıldız sıfırla
$('#sourceText').on('input', function () {
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
    }
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
}


document.getElementById("savedIcon").addEventListener("click", () => {
    window.location.href = "saved.html";
});





function submitLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Giriş başarılı!") {
                // Kullanıcı e-postasını localStorage'a kaydet
                localStorage.setItem("userEmail", email);

                alert(data.message);
                closePopup("girisPopup");
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
        });
}


function submitRegistration() {
    const name = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Kayıt başarılı!") {
                 // Kullanıcı e-postasını localStorage'a kaydet
                localStorage.setItem("userEmail", email);
                alert(data.message);
                closePopup("kayitPopup");
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
        });
}





