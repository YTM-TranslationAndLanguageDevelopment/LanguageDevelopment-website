document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde ilk olarak yetki kontrolü yap
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


            // Çerez Politikası güncelleme
            async function updateCerezPolicy() {
                const data = {
                    page: 'ÇerezPolitikası',
                    backgroundColor: document.getElementById('cerezBackgroundColor').value,
                    fontSize: document.getElementById('cerezFontSize').value,
                    color: document.getElementById('cerezColor').value,
                    content: document.getElementById('cerezContent').value
                };
    
                try {
                    const response = await fetch('/update-policy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
    
                    const result = await response.json();
                    if (result.success) {
                        alert('Çerez Politikası başarıyla güncellendi.');
                    } else {
                        alert('Güncelleme başarısız: ' + result.message);
                    }
                } catch (error) {
                    console.error('Güncelleme hatası:', error);
                    alert('Sunucu hatası.');
                }
            }

        // Gizlilik Politikası güncelleme
        async function updateGizlilikPolicy() {
            const data = {
                page: 'GizlilikPolitikası',
                backgroundColor: document.getElementById('gizlilikBackgroundColor').value,
                fontSize: document.getElementById('gizlilikFontSize').value,
                color: document.getElementById('gizlilikColor').value,
                content: document.getElementById('gizlilikContent').value
            };

            try {
                const response = await fetch('/update-policy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert('Gizlilik Politikası başarıyla güncellendi.');
                } else {
                    alert('Güncelleme başarısız: ' + result.message);
                }
            } catch (error) {
                console.error('Güncelleme hatası:', error);
                alert('Sunucu hatası.');
            }
        }

        // Hakkımızda güncelleme
        async function updateHakkimizdaPolicy() {
            const data = {
                page: 'Hakkımızda',
                backgroundColor: document.getElementById('hakkimizdaBackgroundColor').value,
                fontSize: document.getElementById('hakkimizdaFontSize').value,
                color: document.getElementById('hakkimizdaColor').value,
                content: document.getElementById('hakkimizdaContent').value
            };

            try {
                const response = await fetch('/update-policy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert('Hakkımızda sayfası başarıyla güncellendi.');
                } else {
                    alert('Güncelleme başarısız: ' + result.message);
                }
            } catch (error) {
                console.error('Güncelleme hatası:', error);
                alert('Sunucu hatası.');
            }
        }
    

        // Renk seçim alanları için değişiklik dinleyicileri
        const cerezBackgroundColorInput = document.getElementById('cerezBackgroundColor');
        const cerezBackgroundColorValue = document.getElementById('cerezBackgroundColorValue');
        const cerezColorInput = document.getElementById('cerezColor');
        const cerezColorValue = document.getElementById('cerezColorValue');

        cerezBackgroundColorInput.addEventListener('input', function() {
            cerezBackgroundColorValue.textContent = cerezBackgroundColorInput.value;
        });

        cerezColorInput.addEventListener('input', function() {
            cerezColorValue.textContent = cerezColorInput.value;
        });

        const gizlilikBackgroundColorInput = document.getElementById('gizlilikBackgroundColor');
        const gizlilikBackgroundColorValue = document.getElementById('gizlilikBackgroundColorValue');
        const gizlilikColorInput = document.getElementById('gizlilikColor');
        const gizlilikColorValue = document.getElementById('gizlilikColorValue');

        gizlilikBackgroundColorInput.addEventListener('input', function() {
            gizlilikBackgroundColorValue.textContent = gizlilikBackgroundColorInput.value;
        });

        gizlilikColorInput.addEventListener('input', function() {
            gizlilikColorValue.textContent = gizlilikColorInput.value;
        });

        const hakkimizdaBackgroundColorInput = document.getElementById('hakkimizdaBackgroundColor');
        const hakkimizdaBackgroundColorValue = document.getElementById('hakkimizdaBackgroundColorValue');
        const hakkimizdaColorInput = document.getElementById('hakkimizdaColor');
        const hakkimizdaColorValue = document.getElementById('hakkimizdaColorValue');

        hakkimizdaBackgroundColorInput.addEventListener('input', function() {
            hakkimizdaBackgroundColorValue.textContent = hakkimizdaBackgroundColorInput.value;
        });

        hakkimizdaColorInput.addEventListener('input', function() {
            hakkimizdaColorValue.textContent = hakkimizdaColorInput.value;
        });

        // Metin kutusunun yüksekliğini otomatik ayarlayan fonksiyon
        function autoResizeTextarea(textarea) {
            textarea.style.height = 'auto'; // Yüksekliği sıfırla
            textarea.style.height = textarea.scrollHeight + 'px'; // İçeriğe göre yüksekliği ayarla
        }

        // Tüm textarea elemanlarını seç
        const textareas = document.querySelectorAll('textarea');

        // Her bir textarea için input olayını dinle
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                autoResizeTextarea(this);
            });

            // Sayfa yüklendiğinde mevcut içeriğe göre yüksekliği ayarla
            autoResizeTextarea(textarea);
        });


        // Form submit olaylarını dinle
        document.getElementById('cerezPolicyForm').addEventListener('submit', function(e) {
            e.preventDefault();
            updateCerezPolicy();
        });

        document.getElementById('gizlilikPolicyForm').addEventListener('submit', function(e) {
            e.preventDefault();
            updateGizlilikPolicy();
        });

        document.getElementById('hakkimizdaPolicyForm').addEventListener('submit', function(e) {
            e.preventDefault();
            updateHakkimizdaPolicy();
        });

        const forms = document.querySelectorAll('form');

        // Form id'sini dokümanlardaki page değerine eşleyen bir obje
        const pageMapping = {
            cerezPolicyForm: 'ÇerezPolitikası',
            gizlilikPolicyForm: 'GizlilikPolitikası',
            hakkimizdaPolicyForm: 'Hakkımızda'
        };

        forms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

                const formData = new FormData(form); // Form verilerini al

                try {
                    const response = await fetch('/upload-image', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const imageName = result.imageName; // Sunucudan dönen resim adı

                        // Form id'sini dokümanlardaki page değerine dönüştür
                        const page = pageMapping[form.id];

                        const updateData = {
                            page,
                            imageName
                        };

                        const updateResponse = await fetch('/update-document', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateData)
                        });

                        if (updateResponse.ok) {
                            alert('Doküman başarıyla güncellendi!');
                        } else {
                            alert('Doküman güncellenirken bir hata oluştu.');
                        }
                    } else {
                        alert('Resim yüklenirken bir hata oluştu.');
                    }
                } catch (error) {
                    console.error('Hata:', error);
                    alert('Resim yüklenirken bir hata oluştu.');
                }
            });
        });

        const colorInputs = document.querySelectorAll('input[type="color"]');

        colorInputs.forEach(input => {
            // Başlangıçta arka plan rengini ayarla
            input.style.backgroundColor = input.value;

            // Renk değiştiğinde arka plan rengini güncelle
            input.addEventListener('input', (event) => {
                event.target.style.backgroundColor = event.target.value;
            });
        });

    }
}); 

