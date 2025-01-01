const LoginService = (() => {
    const inputsConfig = [
        {
            id: 'email',
            type: 'email',
            errorId: 'emailError',
            errorMessages: {
                empty: "E-posta alanı boş bırakılamaz.",
                invalid: "Geçerli bir e-posta adresi giriniz.",
            },
        },
        {
            id: 'password',
            type: 'password',
            minLength: 5,
            errorId: 'passwordError',
            errorMessages: {
                empty: "Şifre alanı boş bırakılamaz.",
                short: "Şifre en az 5 karakter olmalıdır.",
            },
        },
    ];

    const validateAll = () => inputsConfig.every((config) => ValidationService.validateField(config));

    const submitLogin = () => {
        if (!validateAll()) return;

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

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
            .catch((error) => console.error("Giriş sırasında bir hata oluştu:", error));
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
        submitLogin,
        handleKeyPress,  // handleKeyPress fonksiyonunu dışarıya açıyoruz
    };
})();

window.submitLogin = LoginService.submitLogin;

document.addEventListener('DOMContentLoaded', () => {
    // Email alanında Enter tuşuna basıldığında Password alanına geçiş
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const passwordInput = document.getElementById('password');
                if (passwordInput) {
                    passwordInput.focus();
                }
            }
        });
    }

    // Password alanında Enter tuşuna basıldığında giriş işlemi tetiklenir
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                LoginService.submitLogin();
            }
        });
    }
});