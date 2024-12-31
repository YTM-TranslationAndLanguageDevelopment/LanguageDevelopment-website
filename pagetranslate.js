document.addEventListener("DOMContentLoaded", () => {
    const inner = document.querySelector('.inner');
    const matches = document.querySelector('.additional-settings .matches');

     // Kullanıcının seçtiği dili kaydetmek ve almak için yardımcı fonksiyonlar
    const getStoredLanguage = () => sessionStorage.getItem("selectedLanguage");
    const storeLanguage = (lang) => sessionStorage.setItem("selectedLanguage", lang);

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
            storeLanguage(targetLang);
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
        // Sayfa çevirisi
    function translatePage(sourceLang, targetLang) {
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        // Metin düğümlerini topla
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim()) textNodes.push(node);
        }

        // Her bir metni çevir
        textNodes.forEach(node => {
            translateText(node.nodeValue, sourceLang, targetLang, (translatedText) => {
                if (translatedText) node.nodeValue = translatedText;
            });
        });

        // Öznitelikleri çevir
        const attributeElements = document.querySelectorAll('[placeholder], [title], [alt]');
        attributeElements.forEach(element => {
            ['placeholder', 'title', 'alt'].forEach(attribute => {
                const originalText = element.getAttribute(attribute);
                if (originalText) {
                    translateText(originalText, sourceLang, targetLang, (translatedText) => {
                        if (translatedText) element.setAttribute(attribute, translatedText);
                    });
                }
            });
        });
    }  

    
       // Sayfa yüklendiğinde dil kontrolü
    const browserLang = navigator.language.split('-')[0]; // Tarayıcı dili
    const storedLang = getStoredLanguage(); // Kaydedilen dil
    const initialLang = storedLang || browserLang; // Tercih edilen veya tarayıcı dili
    const selectedElement = document.querySelector('.matches-group .selected a');
    const sourceLang = selectedElement ? selectedElement.getAttribute('hreflang') : 'auto';

    updateSelectedClass(initialLang); // Seçili dili güncelle
    translatePage(sourceLang, initialLang); // Sayfayı çevir
});