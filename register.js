// Enter tuşu ile alanlar arasında geçiş ve kayıt işlemi
document.addEventListener('DOMContentLoaded', () => {
    // Input alanlarına event listener'ları ekle
    const usernameInput = document.getElementById('newUsername');
    const emailInput = document.getElementById('newEmail');
    const passwordInput = document.getElementById('newPassword');
    const registerButton = document.querySelector('#kayitPopup button[onclick="submitRegistration()"]');

    usernameInput.addEventListener('input', () => {
        const username = usernameInput.value;
        const usernameError = document.getElementById("newUsernameError");
        
        if (!username) {
            usernameError.textContent = "Kullanıcı adı boş bırakılamaz.";
        } else if (username.length < 5) {
            usernameError.textContent = "Kullanıcı adı en az 5 karakter olmalıdır.";
        } else {
            usernameError.textContent = "";
        }
        validatePassword();
    });

    emailInput.addEventListener('input', () => {
        const email = emailInput.value;
        const emailError = document.getElementById("newEmailError");
        
        if (!email) {
            emailError.textContent = "E-posta alanı boş bırakılamaz.";
        } else if (!email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')) {
            emailError.textContent = "Geçerli bir e-posta adresi giriniz (@gmail.com veya @hotmail.com)";
        } else {
            emailError.textContent = "";
        }
    });

    const validatePassword = () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const passwordError = document.getElementById("newPasswordError");
        
        if (!password) {
            passwordError.textContent = "Şifre alanı boş bırakılamaz.";
        } else if (password.length < 5) {
            passwordError.textContent = "Şifre en az 5 karakter olmalıdır.";
        } else if (username === password) {
            passwordError.textContent = "Kullanıcı adı ve şifre aynı olamaz.";
        } else {
            passwordError.textContent = "";
        }
    };

    passwordInput.addEventListener('input', validatePassword);

    // Enter tuşu için event listener
    document.querySelector('#kayitPopup').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            registerButton.click();
        }
    });
});

function validateUsername(username) {
    return username.length >= 5;
}

function validateEmail(email) {
    return email.endsWith('@gmail.com') || email.endsWith('@hotmail.com');
}

function validatePassword(password) {
    return password.length >= 5;
}

// Anlık doğrulama fonksiyonları
function validateRegisterUsername() {
    const username = document.getElementById("newUsername").value;
    const usernameError = document.getElementById("newUsernameError");
    
    if (!username) {
        usernameError.textContent = "Kullanıcı adı boş bırakılamaz.";
        return false;
    } else if (!validateUsername(username)) {
        usernameError.textContent = "Kullanıcı adı en az 5 karakter olmalıdır.";
        return false;
    } else {
        usernameError.textContent = "";
        return true;
    }
}

function validateRegisterEmail() {
    const email = document.getElementById("newEmail").value;
    const emailError = document.getElementById("newEmailError");
    
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

function validateRegisterPassword() {
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const passwordError = document.getElementById("newPasswordError");
    
    if (!password) {
        passwordError.textContent = "Şifre alanı boş bırakılamaz.";
        return false;
    } else if (!validatePassword(password)) {
        passwordError.textContent = "Şifre en az 5 karakter olmalıdır.";
        return false;
    } else if (username === password) {
        passwordError.textContent = "Kullanıcı adı ve şifre aynı olamaz.";
        return false;
    } else {
        passwordError.textContent = "";
        return true;
    }
}

function submitRegistration() {
    const registerButton = document.querySelector('#kayitPopup button[onclick="submitRegistration()"]');
    
    if (registerButton.disabled) {
        return;
    }

    // Son bir kontrol daha yap
    const isUsernameValid = validateRegisterUsername();
    const isEmailValid = validateRegisterEmail();
    const isPasswordValid = validateRegisterPassword();

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
        return;
    }

    const username = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    registerButton.disabled = true;

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
                sessionStorage.setItem("userEmail", email);
                sessionStorage.setItem('authority', 'user');
                closePopup("kayitPopup");
                setVisibility(true);
                startTimer();
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
            alert("Kayıt yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
        })
        .finally(() => {
            registerButton.disabled = false;
        });
}
