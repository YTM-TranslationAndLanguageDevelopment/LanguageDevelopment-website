document.addEventListener('DOMContentLoaded', () => {
    const inputsConfig = [
        {
            id: 'newUsername',
            type: 'username',
            minLength: 5,
            errorId: 'newUsernameError',
            errorMessages: {
                empty: "Kullanıcı adı boş bırakılamaz.",
                short: "Kullanıcı adı en az 5 karakter olmalıdır.",
            }
        },
        {
            id: 'newEmail',
            type: 'email',
            errorId: 'newEmailError',
            errorMessages: {
                empty: "E-posta alanı boş bırakılamaz.",
                invalid: "Geçerli bir e-posta adresi giriniz.",
            }
        },
        {
            id: 'newPassword',
            type: 'password',
            minLength: 5,
            errorId: 'newPasswordError',
            errorMessages: {
                empty: "Şifre alanı boş bırakılamaz.",
                short: "Şifre en az 5 karakter olmalıdır.",
                matchUsername: "Kullanıcı adı ve şifre aynı olamaz.",
            }
        }
    ];

    inputsConfig.forEach((inputConfig, index) => {
        const inputElement = document.getElementById(inputConfig.id);

        inputElement.addEventListener('input', () => validateAndTranslateError(inputConfig));

        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (index < inputsConfig.length - 1) {
                    document.getElementById(inputsConfig[index + 1].id).focus();
                } else {
                    submitRegistration(); // Son inputta Enter ile kayıt
                }
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
    const isValid = inputsConfig.every(inputConfig => validateAndTranslateError(inputConfig));

    if (!isValid) return;

    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const password = document.getElementById('newPassword').value.trim();

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
