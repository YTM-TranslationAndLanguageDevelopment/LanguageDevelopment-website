function profilbilgileriayarla() {

    if (islogin) {
        fetch(`/get-user-info?email=${encodeURIComponent(islogin)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.username && data.email) {
                    console.log(data); // Gelen kullanıcı bilgilerini konsola yazdır
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