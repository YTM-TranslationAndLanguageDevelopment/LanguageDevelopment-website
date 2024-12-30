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
