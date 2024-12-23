function adjustHeight() {
    const sourceTextarea = document.getElementById('sourceText');
    const resultTextarea = document.getElementById('resultText');

    sourceTextarea.style.height = 'auto';
    resultTextarea.style.height = 'auto';

    const maxHeight = Math.max(sourceTextarea.scrollHeight, resultTextarea.scrollHeight);

    // Her iki textarea'nın yüksekliğini eşit yap
    sourceTextarea.style.height = resultTextarea.style.height = maxHeight + 'px';

     // Sayfanın en altına kaydır
     window.scrollTo(0, document.body.scrollHeight);
}

// sourceText için metin girişi olduğunda yüksekliği ayarla
document.getElementById('sourceText').addEventListener('input', adjustHeight);

// resultText için metin girişi olduğunda yüksekliği ayarla
document.getElementById('resultText').addEventListener('input', adjustHeight);


function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
    document.getElementById("sideMenu").style.display="block";
    document.querySelector(".menu-toggle").style.display = "none"; // Açma butonunu gizle
    document.querySelector(".politikalar").style.display = "grid"; 
    document.querySelector(".social-icons").style.display = "grid";
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle.classList.add("hidden"); // Açma butonunu gizle
}

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

// ComboBox değiştirildiğinde yıldız sıfırla
$('#sourceLanguage, #targetLanguage').change(function () {
    resetStarIcon();
    closeRecognizing(); // Ses tanımayı durdur
    toggleMicrophoneState(false);
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





