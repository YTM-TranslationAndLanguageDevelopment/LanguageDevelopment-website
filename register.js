const RegisterService = (() => {
    const inputsConfig = [
        {
            id: 'newUsername',
            type: 'text',
            minLength: 5,
            errorId: 'newUsernameError',
            errorMessages: {
                empty: "Kullanıcı adı boş bırakılamaz.",
                short: "Kullanıcı adı en az 5 karakter olmalıdır.",
            },
        },
        {
            id: 'newEmail',
            type: 'email',
            errorId: 'newEmailError',
            errorMessages: {
                empty: "E-posta alanı boş bırakılamaz.",
                invalid: "Geçerli bir e-posta adresi giriniz.",
            },
        },
        {
            id: 'newPassword',
            type: 'password',
            minLength: 5,
            errorId: 'newPasswordError',
            errorMessages: {
                empty: "Şifre alanı boş bırakılamaz.",
                short: "Şifre en az 5 karakter olmalıdır.",
                sameAsUsername: "Kullanıcı adı ve şifre aynı olamaz.",
            },
        },
    ];

    const validateAll = () => {
        const allValid = inputsConfig.every((config) => ValidationService.validateField(config));
        if (!allValid) return false;

        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value.trim();

        if (username === password) {
            const errorElement = document.getElementById('newPasswordError');
            const errorMessage = inputsConfig.find((config) => config.id === 'newPassword').errorMessages.sameAsUsername;

            // Çeviri yapılacak olan hata mesajını gösteriyoruz
            ValidationService.customTranslateText(errorMessage, 'auto', ValidationService.getTargetLang(), (translatedError) => {
                ValidationService.showTranslatedError(translatedError || errorMessage, errorElement);
            });

            return false;
        }
        return true;
    };

    const submitRegistration = () => {
        if (!validateAll()) return;

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
                    sessionStorage.setItem('authority', 'user');
                    startTimer();
                    closePopup("kayitPopup");
                    setVisibility(true);
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Kayıt sırasında bir hata oluştu:", error));
    };

    // Enter tuşuyla bir sonraki input alanına geçiş fonksiyonu
    const handleKeyPress = (event, nextInputId) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const nextInput = document.getElementById(nextInputId);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    return {
        submitRegistration,
        handleKeyPress,  // handleKeyPress fonksiyonunu dışarıya açıyoruz
    };
})();

window.submitRegistration = RegisterService.submitRegistration;

document.addEventListener('DOMContentLoaded', () => {
    // Username alanında Enter tuşuna basıldığında Email alanına geçiş
    const usernameInput = document.getElementById('newUsername');
    if (usernameInput) {
        usernameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const emailInput = document.getElementById('newEmail');
                if (emailInput) {
                    emailInput.focus();
                }
            }
        });
    }

    // Email alanında Enter tuşuna basıldığında Password alanına geçiş
    const emailInput = document.getElementById('newEmail');
    if (emailInput) {
        emailInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const passwordInput = document.getElementById('newPassword');
                if (passwordInput) {
                    passwordInput.focus();
                }
            }
        });
    }

    // Password alanında Enter tuşuna basıldığında kayıt işlemi tetiklenir
    const passwordInput = document.getElementById('newPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                RegisterService.submitRegistration();
            }
        });
    }
});