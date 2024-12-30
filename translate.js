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

function translateTextAreas() {
    return new Promise((resolve, reject) => {
        const sourceText = $('#sourceText').val();
        const sourceLang = $('#sourceLanguage').val();
        const targetLang = $('#targetLanguage').val();

        if (!sourceText.trim()) {
            $('#resultText').val('');
            resolve(); // Boş metin olduğunda çözümü hemen döndürelim
            return;
        }

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
        
        $.getJSON(url, function (data) {
            $('#resultText').val(data[0][0][0]);
            resolve(); // Çeviri tamamlandığında çözümü döndürelim
        }).fail(function () {
            $('#resultText').val('Çeviri yapılamadı.');
            reject(new Error("Çeviri başarısız"));
        });
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