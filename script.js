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


function togglePanel(panel, isVisible) {
    if (isVisible) {
        panel.classList.add("visible");
        panel.classList.remove("hidden");
    } else {
        panel.classList.remove("visible");
        panel.classList.add("hidden");
    }
}

function hideAllPanels() {
    togglePanel(derecelePanel, false);
    togglePanel(copyPanel, false);
    togglePanel(sharePanel, false);
    togglePanel(savedPanel, false);
    togglePanel(backdrop, false);
}

document.addEventListener("click", (event) => {
    const derecelePanelVisible = derecelePanel.classList.contains("visible");
    const copyPanelVisible = copyPanel.classList.contains("visible");
    const sharePanelVisible = sharePanel.classList.contains("visible");
    const savedPanelVisible = savedPanel.classList.contains("visible");

    if (derecelePanelVisible && !derecelePanel.contains(event.target) && event.target !== dereceleIcon) {
        togglePanel(derecelePanel, false);
    }

    if (copyPanelVisible && !copyPanel.contains(event.target) && event.target !== copyIcon) {
        togglePanel(copyPanel, false);
    }

    if (sharePanelVisible && !sharePanel.contains(event.target) && event.target !== shareIcon) {
        togglePanel(sharePanel, false);
    }

    if (savedPanelVisible && !savedPanel.contains(event.target) && event.target !== savedIcon) {
        togglePanel(savedPanel, false);
        togglePanel(backdrop, false);
    }
});

let hideTimeout;

//copy panel
const copyIcon = document.getElementById("copy");
const copyPanel = document.getElementById("copy-panel");

copyIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    showCopyPanel();
});

function showCopyPanel() {
    const rect = copyIcon.getBoundingClientRect();
    copyPanel.style.top = `${rect.bottom + window.scrollY + 5}px`;
    copyPanel.style.left = `${rect.left + window.scrollX - 22}px`;

    togglePanel(copyPanel, true);

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideAllPanels, 2000);
}

//share panel
const shareIcon = document.getElementById("share");
const sharePanel = document.getElementById("share-panel");

shareIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    showSharePanel();
});

function showSharePanel() {
    const rect = shareIcon.getBoundingClientRect();
    sharePanel.style.top = `${rect.bottom + window.scrollY + 4}px`;
    sharePanel.style.left = `${rect.left + window.scrollX - 66}px`;

    togglePanel(sharePanel, true);

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideAllPanels, 8000);
}

//derecele panel
const dereceleIcon = document.getElementById("derecele");
const derecelePanel = document.getElementById("derecele-panel");

dereceleIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    showDerecelePanel();
});

function showDerecelePanel() {
    const rect = dereceleIcon.getBoundingClientRect();
    derecelePanel.style.top = `${rect.bottom + window.scrollY - 250}px`;
    derecelePanel.style.left = `${rect.left + window.scrollX - 440}px`;

    togglePanel(derecelePanel, true);

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideAllPanels, 8000);
}

const savedIcon = document.getElementById("yıldız");
const savedPanel = document.getElementById("saved-panel");
const dismissButton = document.getElementById("dismiss-button");
const savedloginButton = document.getElementById("saved-login-button");
const backdrop = document.getElementById("backdrop");

function showSavedPanel() {
    togglePanel(backdrop, true);
    togglePanel(savedPanel, true);

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideAllPanels, 10000);
}

// Şimdi değil butonuna tıklanınca panel kapanır
dismissButton.addEventListener("click", () => {
    hideAllPanels();
});

// Oturum aç butonuna tıklanınca giriş fonksiyonu çağrılır ve panel kapanır
savedloginButton.addEventListener("click", () => {
    hideAllPanels();
    openPopup("girisPopup");
});

//Share-panel ikonlar tıklanınca ilgili bağlantıyı açma
const resultTextElement = document.querySelector("#resultText");
const mailtoLink = document.querySelector("#mailto");
const tweettoLink = document.querySelector("#tweetto");

if (resultTextElement) {
    const getText = () => resultTextElement.value.trim();

    // Mailto linkini güncelle
    mailtoLink.addEventListener("click", function (event) {
        const text = getText();
        if (text) {
            this.href = `mailto:?body=${encodeURIComponent(text)}`;
        } else {
            alert("Gönderilecek bir metin bulunamadı.");
            event.preventDefault();
        }
    });

    // Tweetto linkini güncelle
    tweettoLink.addEventListener("click", function (event) {
        const text = getText();
        if (text) {
            this.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        } else {
            alert("Gönderilecek bir metin bulunamadı.");
            event.preventDefault();
        }
    });
} else {
    console.error("#resultText öğesi bulunamadı.");
}


    //Ana menü ikonları işlevleri
// Yıldız simgesi tıklanınca
$('.star-icon').click(async function () {
    const starIcon = $(this);
    const sourceText = $('#sourceText').val().trim().toLowerCase();
    const resultText = $('#resultText').val().trim().toLowerCase();
    const sourceLang = $('#sourceLanguage').val();
    const targetLang = $('#targetLanguage').val();
    const userEmail = sessionStorage.getItem('userEmail');

    // Kullanıcı girişi kontrolü
    if (!userEmail) { 
        showSavedPanel();
        starIcon.attr('src', 'images/bosyıldız.png');
        return;
    }

    // Çeviri verilerinin kontrolü
    if (!sourceText || !resultText) {
        starIcon.attr('src', 'images/bosyıldız.png');
        return;
    }

    try {
        if (starIcon.attr('src') === 'images/bosyıldız.png') {
            // Çeviriyi kaydet
            const response = await fetch('http://localhost:3000/save-translation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    sourceText,
                    resultText,
                    sourceLang,
                    targetLang,
                    savedDate: new Date().toISOString()
                }),
            });

            const data = await response.json();
            if (data.success) {
                starIcon.attr('src', 'images/doluyıldız.png');
            } else {
                alert('Çeviri kaydedilemedi: ' + data.message);
                starIcon.attr('src', 'images/bosyıldız.png');
            }
        } else {
            // Çeviriyi sil
            const response = await fetch('http://localhost:3000/delete-translation', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    sourceText,
                    resultText,
                    sourceLang,
                    targetLang
                }),
            });

            const data = await response.json();
            if (data.success) {
                starIcon.attr('src', 'images/bosyıldız.png');
            } else {
                alert('Çeviri silinemedi: ' + data.message);
                starIcon.attr('src', 'images/doluyıldız.png');
            }
        }
    } catch (error) {
        console.error('İşlem sırasında hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Yıldız simgesini sıfırlama fonksiyonu
function resetStarIcon() {
    const starIcon = $('.star-icon');
    if (starIcon.attr('src') === 'images/doluyıldız.png') {
        starIcon.attr('src', 'images/bosyıldız.png'); // Bosyıldız.png'ye döndür
    }
}

//  Kaynak metin - source text değiştiğinde
let debounceTimeout;

document.getElementById("sourceText").addEventListener("input", async () => {
    hideDictionaryText();
    toggleElementsVisibility();
    closeRecognizing();

    clearTimeout(debounceTimeout); // Önceki timeout'u temizle
    debounceTimeout = setTimeout(async () => {
        const sourceTextValue = document.getElementById("sourceText").value.trim();
        const sourceLang = document.getElementById("sourceLanguage").value;
        const targetLang = document.getElementById("targetLanguage").value;
        const userEmail = sessionStorage.getItem('userEmail');

        // Eğer kaynak metin boşsa yıldız simgesini sıfırlayalım
        if (sourceTextValue === "") {
            document.getElementById("resultText").value = ""; // value ile içeriği temizle
            resetStarIcon();
        } else {
            try {
                // Çeviri işlemi yapmadan önce, metni çevirip bekle
                await translateTextAreas(); // Burada çeviri işlemi yapılacak

                // Çeviri tamamlandıktan sonra resultText'i al
                const resultTextValue = document.getElementById("resultText").value.trim();

                // Kullanıcı girişi kontrolü
                if (!userEmail) { 
                    return;
                }

                // Çeviri işlemi tamamlandığında, veri tabanında mevcut olup olmadığını kontrol et
                const response = await fetch('http://localhost:3000/check-translation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userEmail,
                        sourceText: sourceTextValue,
                        resultText: resultTextValue,
                        sourceLang,
                        targetLang
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    // Eğer çeviri zaten mevcutsa yıldız simgesini dolu yap
                    const starIcon = $('.star-icon');
                    starIcon.attr('src', 'images/doluyıldız.png');
                } else {
                    // Eğer çeviri mevcut değilse yıldız simgesini boş yap
                    resetStarIcon();
                }
            } catch (error) {
                console.error("Çeviri hatası: ", error);
            }
        }
    }, 100); // 100ms sonra işlemi yap
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

// Dil değiştirme ikonuna tıklanıp dillerin ve metinlerin yer değiştirilmesi
$('#swapLanguages').click(function () {
    // sourceLanguage değeri "auto" değilse işlemleri gerçekleştir
    const sourceLang = $('#sourceLanguage').val();
    const targetLang = $('#targetLanguage').val();

    if (sourceLang !== 'auto') {
        closeRecognizing();  
        resetStarIcon();     

        // Dilleri değiştir
        $('#sourceLanguage').val(targetLang);
        $('#targetLanguage').val(sourceLang);

        // Çeviriyi yeniden başlat
        $('#sourceText').val($('#resultText').val());

        translate(); // Çeviriyi yeniden başlat
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
    hideDictionaryText();
    resetStarIcon();
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

//Seslendirme isteği
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

function closeRecognizing() { // Ses tanımayı durdur
    if (recognizing) {
        recognition.stop(); 
        recognizing = false;
        toggleMicrophoneState(false); 
    }
}

//Ses tanıma başladığında ve durduğunda ikonların görünürlükleri
function toggleMicrophoneState(isListening) {
    const microphoneIcon = $('#microfon'); // Mikrofon simgesini doğrudan id ile seç
    const random = document.getElementById("random");

    toggleElementsVisibility();

    if (isListening) {
        microphoneIcon.attr('src', 'images/stopmicrofon.png'); // Mikrofon simgesini "dinleme" durumuna değiştir
        random.style.display = "none";
        hideDictionaryText();
    } else {
        microphoneIcon.attr('src', 'images/microfon.png'); // Mikrofon simgesini eski haline döndür
    }
}

//İkon görünürlük ayarları
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
    if (toggleDictionaryTextVisibility()) {
        return; // dictionaryText görünür, kelime türü belli ise
    }

    const sourceTextarea = document.getElementById("sourceText");
    const dictionaryText = document.getElementById("dictionaryText"); // Sonuçları yazdıracağımız <p> elemanı
    const sourceLang = document.getElementById("sourceLanguage").value; // Girilen metnin dili
    const selectedLanguageElement = document.querySelector(".matches-group .selected a"); // Seçili dilin `hreflang` değerini al
    const selectedLanguage = selectedLanguageElement ? selectedLanguageElement.getAttribute("hreflang") : "en";

    let word = sourceTextarea.value.trim().toLowerCase(); // Metni temizle ve küçük harfe dönüştür
    dictionaryText.textContent = ""; // Önceki sonuçları temizle

    // Kelime geçerli mi kontrol et (boşluk, noktalama işaretleri ve sayılar olmamalı)
    if (/[\s\d.,;:'"!?(){}[\]-]/.test(word)) {
        alert("Lütfen geçerli bir kelime girin.");
        return;
    }

    // Kelimenin türünü bulup yazdırma
    const processWord = (translatedWord) => {
        fetch(`/wordnik-dictionary?word=${encodeURIComponent(translatedWord)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.type) {
                    // Seçili dile "Kelimenin türü: " kısmını çevir ve tür bilgisini yazdır
                    translateText("Kelimenin türü:", "tr", selectedLanguage, (translatedLabel) => {
                        translateText(data.type, "en", selectedLanguage, (translatedType) => {
                            if (translatedLabel && translatedType) {
                                dictionaryText.textContent = `${translatedLabel} ${translatedType}`;
                            } else {
                                // Hata durumunda varsayılan bir mesaj göster
                                translateText("Kelimenin türü alınamadı.", "tr", selectedLanguage, (translatedMessage) => {
                                    dictionaryText.textContent = translatedMessage || "Error retrieving word type.";
                                });
                            }
                        });
                    });
                } else {
                    // Tür bilgisi alınamazsa hata mesajını çevir
                    translateText("Kelimenin türü alınamadı.", "tr", selectedLanguage, (translatedMessage) => {
                        dictionaryText.textContent = translatedMessage || "Error retrieving word type.";
                    });
                }
            })
            .catch((error) => {
                console.error("Wordnik API hatası:", error);
                // Hata durumunda mesajı çevir
                translateText("Kelimenin türü alınamadı.", "tr", selectedLanguage, (translatedMessage) => {
                    dictionaryText.textContent = translatedMessage || "Error retrieving word type.";
                });
            });
    };

    // Türü sorgulanacak metin İngilizce değilse önce İngilizceye çevir
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

document.getElementById("historyIcon").addEventListener("click", (event) => {
    event.stopPropagation();

    // Kullanıcının giriş yapıp yapmadığını kontrol et
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        // Kullanıcı giriş yapmışsa admin.html'e yönlendir
        window.location.href = 'admin.html';
    } else {
        showSavedPanel();
    }
});

document.getElementById('savedLink').addEventListener('click', function(event) {
    event.stopPropagation();

    // Kullanıcının giriş yapıp yapmadığını kontrol et
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        // Kullanıcı giriş yapmışsa a.html'e yönlendir
        window.location.href = 'tablo ve egzersizler/a.html';
    } else {  
        showSavedPanel();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const sourceLanguages = await fetchLanguages('source');
        const targetLanguages = await fetchLanguages('target');

        populateSelectBox(document.getElementById('sourceLanguage'), sourceLanguages);
        populateSelectBox(document.getElementById('targetLanguage'), targetLanguages);
    } catch (error) {
        console.error('Diller yüklenirken hata oluştu:', error);
    }
});

async function fetchLanguages(type) {
    const response = await fetch(`/get-languages/${type}`);
    if (!response.ok) {
        throw new Error('Dil verileri alınamadı.');
    }
    return response.json();
}

function populateSelectBox(selectElement, languages) {
    selectElement.innerHTML = ''; // Mevcut seçenekleri temizle
    for (const [code, name] of Object.entries(languages)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        selectElement.appendChild(option);
    }
}