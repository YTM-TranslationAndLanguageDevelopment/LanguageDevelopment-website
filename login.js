document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        document.getElementById('email'),
        document.getElementById('password')
    ];
    const submitButton = document.getElementById('submitLoginButton');

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
                if (data.redirect === 'admin.html') {
                    window.location.href = data.redirect; // Admin sayfasına yönlendir
                } else {
                    islogin=email;
                    closePopup("girisPopup"); // Giriş popup'ını kapat
                    setVisibility(true);
                }
            } else {
                alert(data.message); // Kullanıcı bulunamadı veya şifre yanlış
            }
        })
        .catch((error) => {
            console.error("Giriş sırasında bir hata oluştu:", error);
        });
}
