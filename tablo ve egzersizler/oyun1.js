let score = 0;

// Sayfa geçişlerini yönetmek için fonksiyon
function goToPage(pageNumber) {
    // Tüm sayfaları gizle
    document.querySelectorAll('.container').forEach(page => {
        page.style.display = 'none';
    });

    // İlgili sayfayı göster
    document.getElementById('page' + pageNumber).style.display = 'block';

    // Puan bilgisini güncelle
    updateScoreDisplay();
}

// Puan göstergelerini güncelleyen fonksiyon
function updateScoreDisplay() {
    document.querySelectorAll('#score').forEach(scoreElement => {
        scoreElement.textContent = 'Puan: ' + score;
    });
}

// Kelime eşleştirme için "drop" fonksiyonu
// function drop(event) {
//     event.preventDefault();
//     let draggedWordId = event.dataTransfer.getData("text");
//     let draggedWord = document.getElementById(draggedWordId);
//     let target = event.target;

//     const correctPairs = {
//         word1: 'trans1',
//         word2: 'trans2',
//         word3: 'trans3',
//         word4: 'trans4',
//         word5: 'trans5',
//         word6: 'trans6',
//         word7: 'trans7',
//         word8: 'trans8',
//         word9: 'trans9',
//     };

//     if (correctPairs[draggedWordId] === target.id) {
//         target.classList.add('correct');
//         draggedWord.classList.add('correct');
//         score++;
//         updateScoreDisplay(); // Puanı güncelle
//     } else {
//         target.classList.add('incorrect');
//         draggedWord.classList.add('incorrect');
//     }

//     setTimeout(() => {
//         target.classList.remove('correct', 'incorrect');
//         draggedWord.classList.remove('correct', 'incorrect');
//     }, 1000);
// }
function drop(event) {
    event.preventDefault();
    let draggedWordId = event.dataTransfer.getData("text");
    let draggedWord = document.getElementById(draggedWordId);
    let target = event.target;

    const correctPairs = {
        word1: 'trans1',
        word2: 'trans2',
        word3: 'trans3',
        word4: 'trans4',
        word5: 'trans5',
        word6: 'trans6',
        word7: 'trans7',
        word8: 'trans8',
        word9: 'trans9',
    };

    // Doğru eşleşme
    if (correctPairs[draggedWordId] === target.id) {
        target.classList.add('correct'); // Kalıcı olarak doğru sınıfı ekle
        draggedWord.classList.add('correct');
        score++; // Puanı artır
        updateScoreDisplay(); // Puanı güncelle
        // Drag özelliğini kaldır (bir daha sürüklenmesin)
        draggedWord.setAttribute('draggable', 'false');
    } else {
        target.classList.add('incorrect'); // Kalıcı olarak yanlış sınıfı ekle
        draggedWord.classList.add('incorrect');
    }
}


// Sürüklemeyi başlatma
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Sürükleme sırasında izin verme
function allowDrop(event) {
    event.preventDefault();
}

// Tüm kelimeler için sürükleme olaylarını bağlama
const words = document.querySelectorAll('.word');
words.forEach(word => {
    word.addEventListener('dragstart', drag);
});
function shuffleTranslations() {
    const pages = document.querySelectorAll('.container');

    pages.forEach(page => {
        const translations = Array.from(page.querySelectorAll('.translations .translation'));
        const parent = translations[0].parentElement;

        // Çevirileri rastgele sırala
        const shuffled = translations.sort(() => Math.random() - 0.5);

        // Sıralanmış çevirileri DOM'a ekle
        shuffled.forEach(translation => parent.appendChild(translation));
    });
}

// Sayfa yüklendiğinde çevirileri karıştır
document.addEventListener('DOMContentLoaded', () => {
    shuffleTranslations();
});
function goToPage(pageNumber) {
    // Tüm sayfaları gizle
    document.querySelectorAll('.container').forEach(page => {
        page.style.display = 'none';
    });

    // İlgili sayfayı göster
    document.getElementById('page' + pageNumber).style.display = 'block';

    // Puan bilgisini güncelle
    updateScoreDisplay();

    // Çevirileri tekrar karıştır
    shuffleTranslations();
}
