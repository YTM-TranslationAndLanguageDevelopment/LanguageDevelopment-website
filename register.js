// Enter tuşu ile alanlar arasında geçiş ve kayıt işlemi
document.addEventListener('DOMContentLoaded', () => {
    // Input alanlarına event listener'ları ekle
    const usernameInput = document.getElementById('newUsername');
    const emailInput = document.getElementById('newEmail');
    const passwordInput = document.getElementById('newPassword');
    const registerButton = document.querySelector('#kayitPopup .submit-button');

    function validateUsername() {
        const username = usernameInput.value;
        const usernameError = document.getElementById("newUsernameError");
        
        if (!username) {
            usernameError.textContent = "Kullanıcı adı boş bırakılamaz.";
            return false;
        } else if (username.length < 5) {
            usernameError.textContent = "Kullanıcı adı en az 5 karakter olmalıdır.";
            return false;
        } else {
            usernameError.textContent = "";
            return true;
        }
    }

<<<<<<< HEAD
    inputsConfig.forEach((inputConfig) => {
        const inputElement = document.getElementById(inputConfig.id);
        if (!inputElement) return;

        inputElement.addEventListener('input', () => validateAndTranslateError(inputConfig));

        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitRegistration();
            }
        });
    });
});

// Genel doğrulama ve hata çevirisi
function validateAndTranslateError({ id, type, minLength, errorId, errorMessages }) {
    const inputElement = document.getElementById(id);
    const errorElement = document.getElementById(errorId);
    const value = inputElement.value.trim();
    const username = document.getElementById('newUsername').value.trim();
    const sourceLang = 'auto'; // Varsayılan hata mesajlarının dili

    const browserLang = navigator.language.split('-')[0];
    const storedLang = sessionStorage.getItem('selectedLanguage');
    const targetLang = storedLang || browserLang;

    let errorMessage = "";

    if (!value) {
        errorMessage = errorMessages.empty;
    } else if (minLength && value.length < minLength) {
        errorMessage = errorMessages.short;
    } else if (type === 'email' && !validateEmail(value)) {
        errorMessage = errorMessages.invalid;
    } else if (type === 'password' && username === value) {
        errorMessage = errorMessages.matchUsername;
    }

    if (errorMessage) {
        // Hata mesajını çevir ve göster
        translateText(errorMessage, sourceLang, targetLang, (translatedError) => {
            errorElement.textContent = translatedError || errorMessage; // Çeviri başarısızsa varsayılan hata
            errorElement.classList.add('active');
        });
        return false;
    } else {
        errorElement.textContent = "";
        errorElement.classList.remove('active');
        return true;
    }
}

// E-posta doğrulama fonksiyonu
function validateEmail(email) {
    return email.endsWith('@gmail.com') || email.endsWith('@hotmail.com');
}

// Kayıt gönderme
function submitRegistration() {
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    
    const usernameError = document.getElementById('newUsernameError');
    const emailError = document.getElementById('newEmailError');
    const passwordError = document.getElementById('newPasswordError');
    
    let hasError = false;

    if (!username) {
        usernameError.textContent = "Kullanıcı adı boş bırakılamaz.";
        usernameError.classList.add('active');
        hasError = true;
    } else {
        usernameError.textContent = "";
        usernameError.classList.remove('active');
    }

    if (!email) {
        emailError.textContent = "E-posta alanı boş bırakılamaz.";
        emailError.classList.add('active');
        hasError = true;
    } else {
        emailError.textContent = "";
        emailError.classList.remove('active');
    }

    if (!password) {
        passwordError.textContent = "Şifre alanı boş bırakılamaz.";
        passwordError.classList.add('active');
        hasError = true;
    } else {
        passwordError.textContent = "";
        passwordError.classList.remove('active');
    }

    if (hasError) return;

    const isValid = ['newUsername', 'newEmail', 'newPassword'].every(id => {
        const inputConfig = inputsConfig.find(config => config.id === id);
        return validateAndTranslateError(inputConfig);
    });

    if (!isValid) return;

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Kayıt başarılı!") {
                sessionStorage.setItem("userEmail", email);
                closePopup("kayitPopup");
                setVisibility(true);
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Kayıt hatası:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        });
}
=======
    function validateEmail() {
        const email = emailInput.value;
        const emailError = document.getElementById("newEmailError");
        
        if (!email) {
            emailError.textContent = "E-posta alanı boş bırakılamaz.";
            return false;
        } else if (!email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')) {
            emailError.textContent = "Geçerli bir e-posta adresi giriniz (@gmail.com veya @hotmail.com)";
            return false;
        } else {
            emailError.textContent = "";
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        const passwordError = document.getElementById("newPasswordError");
        
        if (!password) {
            passwordError.textContent = "Şifre alanı boş bırakılamaz.";
            return false;
        } else if (password.length < 5) {
            passwordError.textContent = "Şifre en az 5 karakter olmalıdır.";
            return false;
        } else {
            passwordError.textContent = "";
            return true;
        }
    }

    // submitRegistration fonksiyonunu global scope'a ekle
    window.submitRegistration = function() {
        if (validateUsername() && validateEmail() && validatePassword()) {
            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Kayıt başarılı!");
                    closePopup('kayitPopup');
                } else {
                    alert(data.message || "Kayıt sırasında bir hata oluştu.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Bir hata oluştu.");
            });
        }
    };

    // Form için Enter tuşu desteği
    document.querySelector('#kayitPopup .popup-content').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            registerButton.click();
        }
    });

    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    // Register butonu için click event listener ekle
    registerButton.addEventListener('click', () => {
        validateUsername();
        validateEmail();
        validatePassword();
    });
});
>>>>>>> 8a68038df52f4934664a73ca2eb1cbae46be58c6
