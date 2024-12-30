document.addEventListener('DOMContentLoaded', () => {
    // Input alanlarına event listener'ları ekle
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('#girisPopup button[onclick="submitLogin()"]');

    emailInput.addEventListener('input', () => {
        const email = emailInput.value;
        const emailError = document.getElementById("emailError");
        
        if (!email) {
            emailError.textContent = "E-posta alanı boş bırakılamaz.";
        } else if (!email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')) {
            emailError.textContent = "Geçerli bir e-posta adresi giriniz (@gmail.com veya @hotmail.com)";
        } else {
            emailError.textContent = "";
        }
    });

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const passwordError = document.getElementById("passwordError");
        
        if (!password) {
            passwordError.textContent = "Şifre alanı boş bırakılamaz.";
        } else if (password.length < 5) {
            passwordError.textContent = "Şifre en az 5 karakter olmalıdır.";
        } else {
            passwordError.textContent = "";
        }
    });

    // Enter tuşu için event listener
    document.querySelector('#girisPopup').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            loginButton.click();
        }
    });
});

function validateEmail(email) {
    return email.endsWith('@gmail.com') || email.endsWith('@hotmail.com');
}

function validatePassword(password) {
    return password.length >= 5;
}

// Anlık doğrulama fonksiyonları
function validateLoginEmail() {
    const email = document.getElementById("email").value;
    const emailError = document.getElementById("emailError");
    
    if (!email) {
        emailError.textContent = "E-posta alanı boş bırakılamaz.";
        return false;
    } else if (!validateEmail(email)) {
        emailError.textContent = "Geçerli bir e-posta adresi giriniz (@gmail.com veya @hotmail.com)";
        return false;
    } else {
        emailError.textContent = "";
        return true;
    }
}

function validateLoginPassword() {
    const password = document.getElementById("password").value;
    const passwordError = document.getElementById("passwordError");
    
    if (!password) {
        passwordError.textContent = "Şifre alanı boş bırakılamaz.";
        return false;
    } else if (!validatePassword(password)) {
        passwordError.textContent = "Şifre en az 5 karakter olmalıdır.";
        return false;
    } else {
        passwordError.textContent = "";
        return true;
    }
}

function submitLogin() {
    const loginButton = document.querySelector('#girisPopup button[onclick="submitLogin()"]');
    
    if (loginButton.disabled) {
        return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Son bir kontrol daha yap
    const isEmailValid = validateLoginEmail();
    const isPasswordValid = validateLoginPassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    loginButton.disabled = true;

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
                sessionStorage.setItem("userEmail", email);
                startTimer();
                
                if (data.redirect === 'admin.html') {
                    sessionStorage.setItem('authority', 'admin');
                    window.open(data.redirect, '_blank');
                    closePopup("girisPopup");
                    setVisibility(true);
                } else {
                    sessionStorage.setItem('authority', 'user');
                    closePopup("girisPopup");
                    setVisibility(true);
                }
                sessionStorage.setItem('userEmail', email);
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Giriş sırasında bir hata oluştu:", error);
            alert("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
        })
        .finally(() => {
            loginButton.disabled = false;
        });
}

// Input alanlarındaki değişiklikleri dinle ve anında doğrula
document.getElementById('email').addEventListener('input', validateLoginEmail);
document.getElementById('password').addEventListener('input', validateLoginPassword);
