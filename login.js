// inputsConfig'i global alanda tanımla
const inputsConfig = [
    {
        id: 'email',
        type: 'email',
        errorId: 'emailError',
        errorMessages: {
            empty: "E-posta alanı boş bırakılamaz.",
            invalid: "Geçerli bir e-posta adresi giriniz.",
        }
    },
    {
        id: 'password',
        type: 'password',
        minLength: 5,
        errorId: 'passwordError',
        errorMessages: {
            empty: "Şifre alanı boş bırakılamaz.",
            short: "Şifre en az 5 karakter olmalıdır.",
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    inputsConfig.forEach((inputConfig) => {
        const inputElement = document.getElementById(inputConfig.id);
        if (!inputElement) return;

        inputElement.addEventListener('input', () => validateAndTranslateError(inputConfig));

        // Enter tuşuna basıldığında sadece giriş işlemini başlat
        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Varsayılan Enter davranışını engelle
                submitLogin(); // Giriş işlemini başlat
            }
        });
    });
});

// Genel doğrulama ve hata çevirisi
function validateAndTranslateError({ id, type, minLength, errorId, errorMessages }) {
    const inputElement = document.getElementById(id);
    const errorElement = document.getElementById(errorId);
    const value = inputElement.value.trim();
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

// Giriş gönderme
function submitLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    let hasError = false;

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

    const isValid = ['email', 'password'].every(id => {
        const inputConfig = inputsConfig.find(config => config.id === id);
        return validateAndTranslateError(inputConfig);
    });

    if (!isValid) return;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Giriş sırasında bir hata oluştu:", error);
            alert("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
        });
}
