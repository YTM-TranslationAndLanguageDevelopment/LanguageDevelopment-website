// Enter tuşu ile alanlar arasında geçiş ve kayıt işlemi
document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        document.getElementById('newUsername'),
        document.getElementById('newEmail'),
        document.getElementById('newPassword'),
    ];

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Varsayılan davranışı engelle
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus(); // Bir sonraki alana odaklan
                } else {
                    submitRegistration(); // Son alanda Enter ile kayıt işlemini başlat
                }
            }
        });
    });
});

function submitRegistration() {
    const username = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    // Form doğrulama
    if (username.length < 5) {
        alert('Kullanıcı adı en az 5 karakter uzunluğunda olmalıdır.');
        return;
    }

    if (!email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')) {
        alert('E-posta yalnızca "@gmail.com" veya "@hotmail.com" ile bitmelidir.');
        return;
    }

    if (password.length < 5) {
        alert('Şifre en az 5 karakter uzunluğunda olmalıdır.');
        return;
    }

    if (username === password) {
        alert('Kullanıcı adı ve şifre aynı olamaz.');
        return;
    }

    if (!username || !email || !password) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Kayıt başarılı!") {
                // Kullanıcı e-postasını sessionStorage'a kaydet
                sessionStorage.setItem("userEmail", email);
                sessionStorage.setItem('authority', 'user');

                closePopup("kayitPopup");
                setVisibility(true);
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
        });
}
