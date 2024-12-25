document.addEventListener("DOMContentLoaded", async () => { 
    const userEmailLabel = document.getElementById("userEmailLabel");
    const userNameLabel = document.getElementById("userNameLabel");

    function openEmail() {
        document.getElementById("userEmailLabel").style.display="block";
    }
    

    function openName() {
        document.getElementById("userNameLabel").style.display="block";
    }

    // localStorage'dan e-posta bilgisi al
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
        userEmailLabel.textContent = `Eposta: ${userEmail}`;
        openEmail();
        openName();

        try {
            // Backend'e istek göndererek kullanıcı bilgilerini al
            const response = await fetch(`http://localhost:3000/user?email=${userEmail}`);
            console.log("Backend Yanıtı:", response);
            const data = await response.json();

            if (response.ok) {
                userNameLabel.textContent = `İsim: ${data.username}`;
            } else {
                console.error("Hata Mesajı:", data.message);
                userNameLabel.textContent = "İsim: Bulunamadı";
            }
        } catch (error) {
            console.error("Kullanıcı bilgileri alınamadı:", error);
            userNameLabel.textContent = "İsim: Bulunamadı"; 
        }
    } else {
        userEmailLabel.textContent = "Eposta: Bilinmiyor";
    }
});
