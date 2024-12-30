document.addEventListener('DOMContentLoaded', () => {
    // Input alanlarına event listener'ları ekle
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('#girisPopup button[onclick="submitLogin()"]');

    function validateEmail() {
        const email = emailInput.value;
        const emailError = document.getElementById("emailError");
        
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
        const passwordError = document.getElementById("passwordError");
        
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

    // Enter tuşu için event listener
    document.querySelector('#girisPopup .popup-content').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginButton.click();
        }
    });

    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    // Login butonu için click event listener ekle
    loginButton.addEventListener('click', () => {
        validateEmail();
        validatePassword();
    });
});
