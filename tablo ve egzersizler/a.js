// FACADE DESENİ 
//karmaşık alt sistemleri tek bir noktadan açğırıyor
// Sayfa yüklendiğinde animasyonları başlat
document.addEventListener('DOMContentLoaded', () => {
    animateAndStyleBoxes();
    addColorChangeEffect();
    addScaleEffect();
    addClickEffect(); // Tıklama efekti ekle
});
//------------------
const animateBoxes = () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        box.style.animation = `slideIn 1s ease ${index * 0.5}s forwards`;
    });
};
// DECORATOR işlevi: 
// Hover efektini ekle(yeni özellikler daha ekliyecez)
const addHoverEffect = (box) => {
    box.classList.add('hovered');
};
//OBSERVER GÖZLEMCİ DESEN
//Bu, bir tür gözlemci deseni kullanımıdır çünkü kullanıcı 
// kutuya fareyle dokunduğunda bu olayı "gözlemleyen" işlevler devreye giriyor.
// Tüm kutulara hover efekti ekleyoruz
document.querySelectorAll('.box').forEach((box) => {
    box.addEventListener('mouseover', () => addHoverEffect(box));
    box.addEventListener('mouseout', () => box.classList.remove('hovered'));
});

//Kutulara animasyon ekledim. ANİMASYON AŞAĞIDAN YUKARI
const addWaveEffect = (box) => {
    box.style.animation = 'wave 1s infinite';
};
const removeWaveEffect = (box) => {
    box.style.animation = '';
};

document.querySelectorAll('.box').forEach((box) => {
    box.addEventListener('mouseover', () => addWaveEffect(box));
    box.addEventListener('mouseout', () => removeWaveEffect(box));
});

// Sayfa yüklendiğinde animasyonları başlat
//document.addEventListener('DOMContentLoaded', animateBoxes); //SIRAYLA ANİMASYOMN SOLDAN SAĞA
// müzik ekleme

const playSound = (soundSrc) => {
    const audio = new Audio(soundSrc);
    audio.play().catch((error) => {
        console.error('Ses çalarken hata oluştu:', error);
    });
};

document.querySelectorAll('.box').forEach((box) => {
    box.addEventListener('mouseover', () => playSound('music/e.wav')); // doğru dosya yolunu kullanın
});

//-----------------------------------
//COMPOSİTE TASARIMININ UYGLADIM (parça bütün ilişkisi olan kutular oluşturdum)
class Box {
    constructor(title, images, url) {
        this.title = title;
        this.images = images;
        this.url = url; // Kutunun yönlendirme adresi
    }
}
const boxes = [
    new Box('Sözlük', ['resimler/dictionary.png', 'resimler/word.png'], 'sozluk.html'),
    new Box('Kelime Egzersizi', ['resimler/checklist.png', 'resimler/hourglass.png'], 'egzersiz2.html'),
    new Box('Oyun', ['resimler/video-games.png'], 'o.html'),
    new Box('Çeviri', ['resimler/languages.png'], '../index.html'),
    new Box('Gelişim', ['resimler/growth.png'], 'gelisim.html'),
];

const container = document.querySelector('.container'); // Kutuların yerleştirileceği alan

boxes.forEach(box => {
    // Link etiketi oluştur
    const link = document.createElement('a');
    link.href = box.url;
    link.classList.add('box');

    // Başlık oluştur
    const header = document.createElement('div');
    header.classList.add('box-header');
    header.textContent = box.title;

    // Resimlerin olduğu div oluştur
    const imagesDiv = document.createElement('div');
    imagesDiv.classList.add('box-images');

    // Her bir resim için img etiketi oluştur ve ekle
    box.images.forEach(imageSrc => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.classList.add('box-img'); // CSS ile stil ver
        imagesDiv.appendChild(img);
    });

    // Linkin içine başlık ve resim divini ekle
    link.appendChild(header);
    link.appendChild(imagesDiv);

    // Kutuyu ana container içine ekle
    container.appendChild(link);
});

//MOLAAAAA
