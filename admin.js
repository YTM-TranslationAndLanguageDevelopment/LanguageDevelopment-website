// Admin panel işlevleri buraya eklenecek 

// Sayfa yüklendiğinde ilk olarak yetki kontrolü yap
document.addEventListener('DOMContentLoaded', function() {
    // "authority" değeri kontrol edilir
    const authority = sessionStorage.getItem('authority');

    if (authority !== 'admin') {
        // Eğer "authority" admin değilse, index.html sayfasına yönlendir
        window.location.href = 'index.html';
    } else {
        // Yan menü seçenekleri için kontrol
        const navItems = document.querySelectorAll('.nav-item');
        const contentHeader = document.querySelector('.content-header h3');
        const pageContents = document.querySelectorAll('.page-content');

        // Aktif menü öğesini işaretle ve içeriği göster
        function setActiveNavItem(clickedItem) {
            // Aktif menü öğesini güncelle
            navItems.forEach(item => item.classList.remove('active'));
            clickedItem.classList.add('active');
            
            // Başlığı güncelle
            const pageName = clickedItem.querySelector('span').textContent;
            contentHeader.textContent = pageName + ' Yönetimi';

            // İçeriği göster/gizle
            const contentId = pageName.toLowerCase()
                .replace(/\s+/g, '')
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ş/g, 's')
                .replace(/ü/g, 'u') + '-content';

            console.log('Aranan content ID:', contentId); // Debug için

            pageContents.forEach(content => {
                if (content.id === contentId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        }

        // Her menü öğesine tıklama olayı ekle
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                setActiveNavItem(this);
            });
        });

        // Sayfa ilk yüklendiğinde Ana Sayfa'yı seç
        setActiveNavItem(navItems[0]);

        // Kullanıcı bilgilerini getir
        const userEmail = sessionStorage.getItem('userEmail');
        
        fetch(`/get-user-info?email=${userEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.username && data.email) {
                const userNameElement = document.querySelector('.user-details h4');
                const userEmailElement = document.querySelector('.user-details p');
                
                userNameElement.textContent = data.username;
                userEmailElement.textContent = data.email;
            } else {
                console.error('Kullanıcı bilgileri alınamadı');
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Bir hata oluştu:', error);
            window.location.href = 'index.html';
        });

        // Profil dropdown kontrolü
        const profileIcon = document.querySelector('.profile-icon');
        const dropdownContent = document.querySelector('.dropdown-content');

        profileIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        dropdownContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        document.addEventListener('click', function() {
            dropdownContent.style.display = 'none';
        });

        // Çıkış yapma işlemi
        const logoutButton = document.querySelector('.dropdown-item.logout');
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            // SessionStorage'ı temizle
            sessionStorage.clear();
            // Ana sayfaya yönlendir
            window.location.href = 'index.html';
        });
    }
}); 