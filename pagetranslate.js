document.addEventListener("DOMContentLoaded", () => {
    const inner = document.querySelector('.inner');
    const matches = document.querySelector('.additional-settings .matches');

    // Dil kutusuna tıklanınca matches görünürlüğünü aç/kapat
    inner.addEventListener('click', function (event) {
        const clickedElement = event.target; // Tıklanan ögeyi al
        const isInsideMatches = clickedElement.closest('.matches'); // Tıklanan öge matches sınıfının içinde mi?
        const isLink = clickedElement.tagName === 'A'; // Tıklanan öge bir link mi?
        
        // Eğer tıklanan matches içindeki bir linkse görünürlüğü kapat
        if (isInsideMatches && isLink) {
            matches.style.display = 'none';
        } 
        // Eğer tıklanan matches'in kendisi ancak bir link değilse, hiçbir şey yapma
        else if (isInsideMatches && !isLink) {
            return;
        } 
        // Tıklanan matches değilse ve inner ise, görünürlüğü aç/kapat
        else {
            matches.style.display = matches.style.display === 'block' ? 'none' : 'block';
        }
    });


    // Dil ekranı dışında bir yere tıklanırsa matches'i kapat
    document.addEventListener('click', function (event) {
        if (matches.style.display === 'block' && !matches.contains(event.target) && !inner.contains(event.target)) {
            matches.style.display = 'none';
        }
    });

    // Kullanıcı bir dil seçtiğinde çağır
    document.querySelectorAll('.matches-group a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetLang = link.getAttribute('hreflang'); // Seçilen dil
            const selectedElement = document.querySelector('.matches-group .selected a');
            const sourceLang = selectedElement ? selectedElement.getAttribute('hreflang') : 'auto';
            
            translatePage(sourceLang, targetLang);
            updateSelectedClass(targetLang);
        });
    });

    function updateSelectedClass(targetLang) { //dil değişiminde selected sınıfı

        // Mevcut 'selected' sınıfını kaldır
        const currentSelected = document.querySelector('.matches-group .selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
    
        // Yeni 'selected' sınıfını ekle
        const matchingLink = document.querySelector(`.matches-group a[hreflang="${targetLang}"]`);
        if (matchingLink) {
            matchingLink.parentElement.classList.add('selected');
        }
    }

        //----------------Sayfa Çevirisi----------------
        function translatePage(sourceLang, targetLang) {
            // Tüm metin düğümlerini bul
            const textNodes = [];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue.trim()) {
                    textNodes.push(node);
                }
            }
        
            // Çeviri için tüm metinleri topla
            const texts = textNodes.map(node => node.nodeValue);
        
            // Her bir metni çevir ve DOM'u güncelle
            texts.forEach((text, index) => {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
                
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        textNodes[index].nodeValue = data[0][0][0];
                    })
                    .catch(error => {
                        console.error(`"${text}" metni çevrilemedi:`, error);
                    });
            });
    

            // Sayfadaki tüm placeholder'ları çevir
            const placeholderElements = document.querySelectorAll('[placeholder]');
            placeholderElements.forEach(element => {
                translateElementText(element, sourceLang, targetLang);
            });
        }
    
        function translateElementText(element, sourceLang, targetLang) {
            const originalText = element.placeholder || element.innerHTML;
            if (originalText) {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(originalText)}`;
    
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        const translatedText = data[0][0][0];
                        if (element.placeholder !== undefined) {
                            element.placeholder = translatedText;
                        } else {
                            element.innerHTML = translatedText;
                        }
                    })
                    .catch(error => {
                        console.error(`"${originalText}" metni çevrilemedi:`, error);
                    });
            }

        }

    
        const browserLang = navigator.language.split('-')[0]; // Tarayıcı dili (ör. "en-US" → "en")
        const selectedElement = document.querySelector('.matches-group .selected a');
        const sourceLang = selectedElement ? selectedElement.getAttribute('hreflang') : 'auto';
        translatePage(sourceLang, browserLang);
        updateSelectedClass(browserLang);
});