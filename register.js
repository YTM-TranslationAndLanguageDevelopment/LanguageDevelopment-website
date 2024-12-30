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
