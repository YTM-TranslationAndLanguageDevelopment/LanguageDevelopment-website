function profilbilgileriayarla() {
    const userEmail = sessionStorage.getItem("userEmail");
    if (userEmail) {
        fetch(`/get-user-info?email=${encodeURIComponent(userEmail)}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Temel bilgileri ekrana yaz
                    document.getElementById("profilUserName").textContent = data.username;
                    document.getElementById("profilEmail").textContent = data.email;
                    document.getElementById("totalScore").textContent = data.totalScore;

                    // Studied Time formatını hesapla
                    const studiedTime = data.studiedTime;
                    let timeString = studiedTime < 60
                        ? `${studiedTime} min`
                        : `${Math.floor(studiedTime / 60)} h ${studiedTime % 60} min`;
                    document.getElementById("studiedTime").textContent = timeString;

                    // Streak bilgisi
                    document.getElementById("streak").textContent = data.streak;

                    const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

                    // Günler ve ikonları ayarla
                    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const reverseOrder = ['sunday', 'saturday', 'friday', 'thursday', 'wednesday', 'tuesday', 'monday'];

                    let firstTrueFound = false;

                    reverseOrder.forEach((day, reverseIndex) => {
                        const actualIndex = daysOrder.indexOf(day); // Günlerin sırasına göre indeks bul
                        const dayElement = document.querySelectorAll(".days-section .day")[actualIndex];
                        const span = dayElement.querySelector("span");
                        const img = dayElement.querySelector("img");

                        // Gün adını ayarla
                        span.textContent = dayNames[actualIndex];

                        // İkonları belirle
                        if (!data.studiedDays[day] && !firstTrueFound) {
                            img.src = "images/circle.png"; // İlk true bulunana kadar "circle"
                        } else if (data.studiedDays[day]) {
                            img.src = "images/accept.png"; // True için "accept"
                            firstTrueFound = true;
                        } else {
                            img.src = "images/x-mark.png"; // İlk true'dan sonraki false için "x-mark"
                        }

                        // Bugün olan günün arka planını değiştir
                        if (day === today) {
                            dayElement.style.backgroundColor = "#f8ff91"; // Bugün olan gün için arka plan rengini değiştir
                        }

                    });
                } else {
                    alert("Kullanıcı bilgileri alınamadı.");
                }
            })
            .catch(error => console.error("Profil bilgileri alınırken hata oluştu:", error));
    } else {
        alert("Kullanıcı oturumu açık değil.");
    }
}
