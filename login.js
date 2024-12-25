document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        document.getElementById('email'),
        document.getElementById('password')
    ];

    // Enter tuşu ile alanlar arasında geçiş ve giriş
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    submitLogin(); // Son alanda Enter ile giriş yap
                }
            }
        });
    });
});

function submitLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Eposta ve şifre alanlarının boş bırakılmaması için doğrulama
    if (!email || !password) {
        alert("E-posta ve şifre boş bırakılamaz!");
        return;
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                
                // Kullanıcı e-postasını localStorage'a kaydet
                localStorage.setItem("userEmail", email);
                
                if (data.redirect === 'admin.html') {
                    localStorage.setItem('authority', 'admin');
                    window.open(data.redirect, '_blank'); // Admin sayfasına yönlendir
                    closePopup("girisPopup"); // Giriş popup'ını kapat
                    setVisibility(true);
                } else {
                    localStorage.setItem('authority', 'user');
                    closePopup("girisPopup"); // Giriş popup'ını kapat
                    setVisibility(true);
                }
                localStorage.setItem('userEmail', email);
                islogin=email;
            } else {
                alert(data.message); // Kullanıcı bulunamadı veya şifre yanlış
            }
        })
        .catch((error) => {
            console.error("Giriş sırasında bir hata oluştu:", error);
        });
}
