function profilbilgileriayarla() {
    // sessionStorage'dan e-posta bilgisi al
    const userEmail = sessionStorage.getItem("userEmail");
    if (userEmail) {
        fetch(`/get-user-info?email=${encodeURIComponent(userEmail)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.username && data.email) {
                    document.getElementById("profilUserName").textContent = `Kullanıcı adı: ${data.username}`;
                    document.getElementById("profilEmail").textContent = `Eposta: ${data.email}`;
                } else {
                    alert("Kullanıcı bilgileri alınamadı.");
                }
            })
            .catch(error => console.error("Profil bilgileri alınırken hata oluştu:", error));
    } else {
        alert("Kullanıcı oturumu açık değil.");
    }
}