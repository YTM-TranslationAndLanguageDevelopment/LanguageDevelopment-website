// Hedef Süre (dakika)
let targetTime = 15; // Kullanıcıdan alınabilir
let remainingTime = targetTime * 60; // Saniye cinsinden
let timer; // Timer değişkeni, aktif olup olmadığını kontrol edebilmek için

// Zamanlayıcı Başlatma
function startTimer() {
    // Eğer zamanlayıcı zaten çalışıyorsa tekrar başlatma
    if (timer) {
        return; // Eğer zamanlayıcı zaten aktifse, fonksiyondan çık
    }

    // Zamanlayıcıyı her saniye bir kez çalıştır
    timer = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updateTimerDisplay(remainingTime);
        } else {
            clearInterval(timer); // Zamanlayıcıyı durdur
            alert("Tebrikler! Günlük hedefinizi tamamladınız!"); // Zaman bitince kutu göster
            timer = null; // Timer değişkenini sıfırla
        }
    }, 1000);
}

// Zamanlayıcıyı Güncelleme
function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);  // Dakika hesaplama
    const seconds = time % 60;  // Saniye hesaplama
    document.getElementById('timer-display').innerText = 
        `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Saat ve dakika göstergesi
}

// Hedef Hatırlatıcı
function dailyReminder() {
    const now = new Date();
    if (now.getHours() === 20 && remainingTime > 0) { // Örneğin, 20:00'de hatırlatma
        alert("Bugün hedefinize ulaşmadınız! Yarın daha fazla çalışmayı deneyin.");
    }
}

// Saatlik kontrol için hatırlatıcı fonksiyonunu başlat
setInterval(dailyReminder, 3600000); // Her saat başı kontrol (1 saat = 3600000 ms)
