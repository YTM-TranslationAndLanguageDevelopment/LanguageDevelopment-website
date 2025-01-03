class Header extends HTMLElement { //HTMLElement sınıfından Header adında bir sınıf türet.
    connectedCallback() { //Element dom üzerinde yerleştirildiği anda çalışacak metot
        this.innerHTML = `
        
    <!-- Üst Kısım (Header) -->
    <header>


<!-- Profil Popup -->
<div id="profilPopup" class="popup">
    <div class="popup-content">
        <span class="close" onclick="closePopup('profilPopup')">&times;</span>
        <div class="profile-settings">
        <div class="profile-section">
            <img src="images/user.png" alt="User Icon" class="icon">
            <p>Kullanıcı adı:</p>
            <span id="profilUserName"></span>
        </div>
        <div class="profile-section">
            <img src="images/profilEnvelope.png" alt="Envelope Icon" class="icon">
            <p>E-mail:</p>
            <span id="profilEmail"></span>
        </div>
        <div class="profile-section">
            <img src="images/target.png" alt="Target Icon" class="icon">
            <p>Toplam score:</p>
            <span id="totalScore"></span>
        </div>
        <div class="profile-section">
            <img src="images/study-time.png" alt="Study Time Icon" class="icon">
            <p>Çalışılan zaman:</p>
            <span id="studiedTime"></span>
        </div>
        <div class="days-section">
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Mon</span>
            </div>
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Tue</span>
            </div>
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Wed</span>
            </div>
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Thu</span>
            </div>
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Fri</span>
            </div>
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Sat</span>
            </div>
            <div class="day">
                <img src="images/circle.png" alt="ikon" class="circle">
                <span>Sun</span>
            </div>
        </div>
        <div class="streak-section">
            <img src="images/burn.png" alt="Burn Icon" class="icon">
            <p id="streak">0</p>
            <span>gün</span>
        </div>
        <button id="exitProfil" class="exitProfil">Oturumu kapat</button>
    </div>
 </div>
</div>

        <!-- Giriş Yap Popup -->
    <div id="girisPopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup('girisPopup')">&times;</span>
            <h2>Giriş Yap</h2>
            <div class="input-group">
                <label for="email">E-posta:</label>
                <input type="email" id="email" name="email" placeholder="E-posta adresinizi girin">
                <span id="emailError" class="error-message"></span>
            </div>
            <div class="input-group">
                <label for="password">Şifre:</label>
                <input type="password" id="password" name="password" placeholder="Şifrenizi girin">
                <span id="passwordError" class="error-message"></span>
            </div>
                <button type="button" onclick="LoginService.submitLogin()">Giriş Yap</button>
            <p>Hesabınız yok mu? <a href="" id="signupFromLogin" onclick="closePopup('girisPopup'); openPopup('kayitPopup');">Kayıt Ol</a></p>
        </div>
    </div>

    <!-- Kayıt Ol Popup -->
    <div id="kayitPopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup('kayitPopup')">&times;</span>
            <h2>Kayıt Ol</h2>
            <div class="input-group">
                <label for="newUsername">Kullanıcı Adı:</label>
                <input type="text" id="newUsername" name="newUsername" placeholder="Kullanıcı adınızı girin">
                <span id="newUsernameError" class="error-message"></span>
            </div>
            <div class="input-group">
                <label for="newEmail">E-posta:</label>
                <input type="email" id="newEmail" name="newEmail" placeholder="E-posta adresinizi girin">
                <span id="newEmailError" class="error-message"></span>
            </div>
            <div class="input-group">
                <label for="newPassword">Şifre:</label>
                <input type="password" id="newPassword" name="newPassword" placeholder="Şifrenizi girin">
                <span id="newPasswordError" class="error-message"></span>
            </div>
                <button class="submit-button" onclick="RegisterService.submitRegistration()">Kayıt Ol</button>
        </div>
    </div>
        <div class="header-container">
        <button type="button" id="profilbutton" onclick="openPopup('profilPopup')">Profil</button>
        <button type="button" id="settingsbutton"  onclick="openPopup('settingsPopup')" >Ayarlar</button>
        <button type="button" id="loginbutton" onclick="openPopup('girisPopup')">Giriş Yap</button>
        <button type="button" id="registerbutton" onclick="openPopup('kayitPopup')">Kayıt Ol</button>
        </div>

         <!-- Yan Menü -->
    <aside id="sideMenu" class="side-menu">
        <a href="javascript:void(0)" class="closebtn" onclick="closeMenu()">&times;</a>
        <div class="politikalar">
        <div class="politikadiv"  onclick="window.location.href='GizlilikPolitikası.html';">
            <img src="images/verified.png" title="verified" class="verified" alt="verified">
            <a>Gizlilik Politikası</a>
        </div>
        <div class="politikadiv" onclick="window.location.href='ÇerezPolitikası.html';">
            <img src="images/cookie.png" title="cookie" class="cookie" alt="cookie">
            <a>Çerez Politikası</a>
        </div>
        <div class="politikadiv" onclick="window.location.href='Hakkımızda.html';">
            <img src="images/group.png" title="group" class="group" alt="group">
            <a>Hakkımızda</a>
        </div>
        </div>
        <div class="social-icons">
            <a href="https://github.com/AliKacarr" target="_blank"><img src="images/github.png" alt="GitHub"></a>
            <a href="https://www.linkedin.com/in/ali-ka%C3%A7ar-6878ab251/" target="_blank"><img src="images/linkedin.png" alt="LinkedIn"></a>
            <a href="https://www.youtube.com/@alikacar4645/videos" target="_blank"><img src="images/youtube.png" alt="YouTube"></a>
            <a href="https://m.facebook.com/profile.php/?id=100027508234162" target="_blank"><img src="images/facebook.png" alt="Facebook"></a>
            <a href="https://twitter.com/alikacar23" target="_blank"><img src="images/x.png" alt="X"></a>
            <a href="https://www.instagram.com/alikacar23/" target="_blank"><img src="images/instagram.png" alt="X"></a>
        </div>
    </aside>
    <div class="additional-settings ">
        <div id="settings" class="button settings">
            <div class="inner">
                <a id="setting" aria-label="Settings">
                    <img src="images/logo.png" title="" class="logo" alt="Dil">
                </a>
        </div>

        <div class="matches">
                <h2>Language</h2>
                <ul class="matches-group wide">
                    <li style="direction: rtl;"><a hreflang="ar" >عربي</a></li>
                    <li> <a hreflang="bg" >Български</a> </li>
                    <li><a hreflang="cs" >Čeština</a></li>
                    <li> <a hreflang="de" >Deutsch</a></li>
                    <li> <a hreflang="en" >English</a></li>
                    <li class="selected"> <a hreflang="tr" >Türkçe</a></li>
                    <li> <a hreflang="es" >Español</a></li>
                    <li> <a hreflang="fr" >Français</a></li>
                    <li>  <a hreflang="hr" >Hrvatski</a></li>
                    <li>  <a hreflang="hu" >Magyar</a></li>
                    <li><a hreflang="it"  >Italiano</a></li>
                    <li><a hreflang="ka"  >ქართული ენა</a> </li>
                    <li> <a hreflang="nl" >Nederlands</a> </li>
                    <li> <a hreflang="pl" >Polski</a>  </li>
                    <li> <a hreflang="pt" >Português</a> </li>
                    <li> <a hreflang="ro" >Română</a></li>
                    <li> <a hreflang="ru" >Pусский</a></li>
                    <li> <a hreflang="sk" >Slovenský</a></li>
                    <li> <a hreflang="el" >Ελληνικά</a></li>
                    <li> <a hreflang="sr" >Srpski</a></li>
                    <li>  <a hreflang="uk" >Українська</a> </li>
                </ul>
            </div>
        </div>
    </div>


    </header>
    <div class="menu-toggle" onclick="openMenu()">☰</div>
        `;
    }
}

// Header sınıfı <my-header> adlı özel bir HTML elementi olarak kaydedilir.
customElements.define('my-header', Header);

document.addEventListener("DOMContentLoaded", function () {
    // sessionStorage'da 'userEmail' var mı kontrol et
    const userEmail = sessionStorage.getItem('userEmail');

    if (userEmail) {
        setVisibility(true);
    }
});

//yan menüyü açma 
function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
    document.getElementById("sideMenu").style.display="block";
    document.querySelector(".menu-toggle").style.display = "none"; // Açma butonunu gizle
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle.classList.add("hidden"); // Açma butonunu gizle
    document.querySelector(".politikalar").style.display = "grid"; 
    document.querySelector(".social-icons").style.display = "grid";
}
//yan menüyü kapatma
function closeMenu() {
    document.getElementById("sideMenu").style.width = "0";
    document.querySelector(".menu-toggle").style.display = "block"; // Açma butonunu göster
    document.querySelector(".politikalar").style.display = "none"; //fecade tasarım
    document.querySelector(".social-icons").style.display = "none"; //ekran kapanırken bloklaşma gösterilmiyor
    setTimeout(() => {
        const menuToggle = document.querySelector(".menu-toggle");
        menuToggle.classList.remove("hidden"); // Açma butonunu yavaşça göster
    }, 300);
}

function openPopup(id) {
    if(id === 'settingsPopup'){return;}//Burası sonradan silinecek

    document.getElementById(id).style.display = 'flex';

    // Metin kutularını temizle
    if (id === 'girisPopup') {
        document.getElementById("email").value = ""; // Giriş için eposta
        document.getElementById("password").value = ""; // Giriş için şifre
    } else if (id === 'kayitPopup') {
        document.getElementById("newUsername").value = ""; // Kayıt için kullanıcı adı
        document.getElementById("newEmail").value = ""; // Kayıt için eposta
        document.getElementById("newPassword").value = ""; // Kayıt için şifre
    }else if (id === 'profilPopup') {
        document.getElementById("profilUserName").value = ""; // Profil için kullanıcı adı
        document.getElementById("profilEmail").value = ""; // Profil için eposta
        document.getElementById("totalScore").value = ""; // Profil için totalScore
        document.getElementById("studiedTime").value = ""; // Profil studiedTime
        document.getElementById("streak").value = ""; // Profil için streak
        profilbilgileriayarla();
    }
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
    const popup = document.getElementById(id);
    const errorMessages = popup.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = ""; // Mesaj içeriğini temizle
        error.classList.remove('active'); // Görünürlüğü kapat
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Kullanıcı hesaptan çıkışı
    document.getElementById('exitProfil').addEventListener('click', (event) => {
        event.preventDefault(); // Link varsayılan davranışını engelle
        closePopup('profilPopup'); // Popup'ı kapat
        setVisibility(false); // Kullanıcı çıkış yaptı, görünürlük ayarla
        
        // 'selectedLanguage' değerini çıkıştan önce al
        const selectedLanguage = sessionStorage.getItem('selectedLanguage');

        // Tüm sessionStorage'ı temizle
        sessionStorage.clear();

        // 'selectedLanguage' değerini tekrar ayarla
        if (selectedLanguage) {
            sessionStorage.setItem('selectedLanguage', selectedLanguage);
        }

        stopTimer();
    });
});


/* Giriş yapılınca butonları ayarlama */
function setVisibility(isLoggedIn) {
    const profilButton = document.getElementById('profilbutton');
    const settingsButton = document.getElementById('settingsbutton');
    const loginButton = document.getElementById('loginbutton');
    const registerButton = document.getElementById('registerbutton');

    if (isLoggedIn) {
        profilButton.style.display = 'inline-block'; // Profil butonu görünür
        settingsButton.style.display = 'inline-block'; // Ayarlar butonu görünür
        loginButton.style.display = 'none'; // Giriş butonu gizli
        registerButton.style.display = 'none'; // Kayıt ol butonu gizli
    } else {
        profilButton.style.display = 'none'; // Profil butonu gizli
        settingsButton.style.display = 'none'; // Ayarlar butonu görünür
        loginButton.style.display = 'inline-block'; // Giriş butonu görünür
        registerButton.style.display = 'inline-block'; // Kayıt ol butonu görünür
    }
}
