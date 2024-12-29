let timerInterval = null;

function startTimer() {
    if (sessionStorage.getItem("timerRunning") === "true") return; // Timer zaten çalışıyorsa yeniden başlatma
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) return; // Kullanıcı giriş yapmamışsa Timer çalışmasın

    sessionStorage.setItem("timerRunning", "true"); // Timer çalışıyor olarak işaretle

    timerInterval = setInterval(() => {
        updateStudiedTime(1); // Her dakika sadece "1" dakika ekle
    }, 60000); // Her dakika çalıştır
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        sessionStorage.removeItem("timerRunning"); // Timer çalışmıyor olarak işaretle
    }
}

function updateStudiedTime(minutes) {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
        stopTimer(); // Kullanıcı oturumu kapatmışsa Timer'ı durdur
        return;
    }

    fetch("/update-studied-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, minutes }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                console.error("StudiedTime güncellenirken hata oluştu:", data.message);
            }
        })
        .catch((error) => console.error("Sunucu hatası:", error));
}

// Sayfa yüklendiğinde Timer kontrolü
document.addEventListener("DOMContentLoaded", () => {
    const userEmail = sessionStorage.getItem("userEmail");

    if (userEmail) {
        startTimer(); // Kullanıcı giriş yapmışsa Timer'ı başlat
    } else {
        stopTimer(); // Kullanıcı çıkış yapmışsa Timer'ı durdur
    }

    // Tarayıcı kapanışında süreyi kaydet
    window.addEventListener("beforeunload", () => {
        stopTimer();
        if (studiedMinutes > 0) {
            updateStudiedTime(studiedMinutes);
        }
    });
});
