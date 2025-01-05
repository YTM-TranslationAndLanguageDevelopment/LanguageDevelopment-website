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
            contentHeader.textContent = pageName.endsWith('Yönetimi') ? pageName : pageName + ' Yönetimi';

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

            // Eğer "Çeviri Yönetimi" seçildiyse, ilgili içeriği yükle
            if (contentId === 'ceviriyonetimi-content') {
                loadTranslationManagementContent();
            }else if(contentId === 'kullaniciyonetimi-content'){
                loadUserManagementContent();
            }
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
                const page = pageMapping[form.id]; // Form id'sini page değerine eşle
        
                // Resim seçilmişse, resim yükle
                let imageName = null;
                if (formData.get('backgroundImage') && formData.get('backgroundImage').size > 0) {
                    try {
                        const uploadResponse = await fetch('/upload-image', {
                            method: 'POST',
                            body: formData
                        });
        
                        if (uploadResponse.ok) {
                            const uploadResult = await uploadResponse.json();
                            imageName = uploadResult.imageName; // Sunucudan dönen resim adı
                        } else {
                            alert('Resim yüklenirken bir hata oluştu.');
                            return;
                        }
                    } catch (error) {
                        console.error('Resim yüklenirken bir hata oluştu:', error);
                        alert('Resim yüklenirken bir hata oluştu.');
                        return;
                    }
                }
        
                // Politika güncelleme verisi
                const data = {
                    page,
                    backgroundColor: formData.get('backgroundColor'),
                    fontSize: formData.get('fontSize'),
                    color: formData.get('color'),
                    content: formData.get('content'),
                    imageName // Eğer resim yüklenmemişse null gönderilecek
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
                        alert(`${page} başarıyla güncellendi.`);
                    } else {
                        alert(`Güncelleme başarısız: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Politika güncellenirken hata oluştu:', error);
                    alert('Sunucu hatası oluştu.');
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

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');

    // Form id'lerini veritabanındaki page değerleriyle eşleştiren bir obje
    const pageMapping = {
        cerezPolicyForm: 'ÇerezPolitikası',
        gizlilikPolicyForm: 'GizlilikPolitikası',
        hakkimizdaPolicyForm: 'Hakkımızda'
    };

    forms.forEach(async form => {
        const pageName = pageMapping[form.id];

        try {
            const response = await fetch(`/get-policy-data/${pageName}`);
            if (response.ok) {
                const data = await response.json();

                const backgroundColorInput = form.querySelector('input[name="backgroundColor"]');
                const backgroundColorSpan = form.querySelector('span#cerezBackgroundColorValue');
                const fontSizeInput = form.querySelector('input[name="fontSize"]');
                const colorInput = form.querySelector('input[name="color"]');
                const colorSpan = form.querySelector('span#cerezColorValue');
                const contentTextarea = form.querySelector('textarea[name="content"]');
                const imagePreview = form.querySelector('.image-preview');
                const fileInput = form.querySelector('input[name="backgroundImage"]');

                if (backgroundColorInput) {
                    backgroundColorInput.value = data.backgroundColor;
                    backgroundColorInput.style.backgroundColor = data.backgroundColor;
                    if (backgroundColorSpan) backgroundColorSpan.textContent = data.backgroundColor;
                }

                if (colorInput) {
                    colorInput.value = data.color;
                    colorInput.style.backgroundColor = data.color;
                    if (colorSpan) colorSpan.textContent = data.color;
                }

                if (fontSizeInput) fontSizeInput.value = parseInt(data.fontSize);
                if (contentTextarea) contentTextarea.value = data.content;
                

                if (data.imageName) {
                    const img = document.createElement('img');
                    img.src = `/images/${data.imageName}`;
                    img.alt = 'Mevcut Resim';
                    img.style.width = '200px';
                    img.style.height = '200px';
                    img.style.objectFit = 'cover'; // Resmi cover yap
                    imagePreview.innerHTML = ''; // Önceki resmi temizle
                    imagePreview.appendChild(img);
                    imagePreview.style.display = 'block'; // Görünür yap
                } else {
                    imagePreview.style.display = 'none'; // Gizle
                }

                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.alt = 'Yeni Resim';
                            img.style.width = '200px';
                            img.style.height = '200px';
                            img.style.objectFit = 'cover'; // Resmi cover yap
                            imagePreview.innerHTML = ''; // Önceki resmi temizle
                            imagePreview.appendChild(img);
                            imagePreview.style.display = 'block'; // Görünür yap
                        };
                        reader.readAsDataURL(file);
                    } else {
                        imagePreview.innerHTML = ''; // Resim seçilmezse önizlemeyi temizle
                        imagePreview.style.display = 'none'; // Görünürlüğü kapat
                    }
                });

                // Renk değiştiğinde metni güncelle
                const colorInputs = form.querySelectorAll('input[type="color"]');
                colorInputs.forEach(input => {
                    input.addEventListener('input', (event) => {
                        const span = event.target.nextElementSibling;
                        if (span) {
                            span.textContent = event.target.value;
                        }
                    });
                });

            } else {
                console.error('Sayfa verileri alınamadı.');
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    });

});



function populateSelect(selectElement, languages) {
    selectElement.innerHTML = ''; // Mevcut seçenekleri temizle
    for (const [code, name] of Object.entries(languages)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        selectElement.appendChild(option);
    }
}

async function modifyLanguages(type, action, languageCode) {
    try {
        const response = await fetch(`/modify-languages/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, languageCode }),
        });

        if (response.ok) {
            const updatedLanguages = await response.json();
            const selectElement = document.getElementById(type === 'source' ? 'sourceLanguageList' : 'targetLanguageList');
            populateSelect(selectElement, updatedLanguages);
        } else {
            console.error('Dil güncellenemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

// "Çeviri Yönetimi" içeriğini yükleyen fonksiyon
async function loadTranslationManagementContent() {
    const ceviriYonetimiContent = document.getElementById('ceviriyonetimi-content');

    if (ceviriYonetimiContent) {
        try {
            const sourceResponse = await fetch('/get-languages/source');
            const targetResponse = await fetch('/get-languages/target');

            if (sourceResponse.ok && targetResponse.ok) {
                const sourceLanguages = await sourceResponse.json();
                const targetLanguages = await targetResponse.json();

                const sourceSelect = document.getElementById('sourceLanguageList');
                const targetSelect = document.getElementById('targetLanguageList');
                const availableSelect = document.getElementById('availableLanguages');

                populateSelect(sourceSelect, sourceLanguages);
                populateSelect(targetSelect, targetLanguages);

                document.getElementById('addSourceLanguage').addEventListener('click', () => {
                    modifyLanguages('source', 'add', availableSelect.value);
                });

                document.getElementById('removeSourceLanguage').addEventListener('click', () => {
                    modifyLanguages('source', 'remove', sourceSelect.value);
                });

                document.getElementById('addTargetLanguage').addEventListener('click', () => {
                    modifyLanguages('target', 'add', availableSelect.value);
                });

                document.getElementById('removeTargetLanguage').addEventListener('click', () => {
                    modifyLanguages('target', 'remove', targetSelect.value);
                });

                ceviriYonetimiContent.classList.remove('hidden');
            } else {
                console.error('Dil verileri alınamadı.');
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    }
}

async function loadUserManagementContent() {
    try {
        const response = await fetch('/get-users');
        if (response.ok) {
            const users = await response.json();
            populateUserTable(users);
        } else {
            console.error('Kullanıcı verileri alınamadı.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = ''; // Mevcut satırları temizle

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.totalScore}</td>
            <td>${user.streak}</td>
            <td>${user.studiedTime}</td>
            <td>${new Date(user.createDate.$date).toLocaleDateString()}</td>
            <td>${new Date(user.lastLoginDay.$date).toLocaleDateString()}</td>
            <td>
                <input type="text" value="${user.authority}" data-email="${user.email}" class="authority-input">
            </td>
            <td>
                <button class="edit-btn" data-email="${user.email}">Güncelle</button>
                <button class="delete-btn" data-email="${user.email}">Sil</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });

    // Güncelle ve sil butonlarına olay dinleyicileri ekle
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', updateUserAuthority);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteUser);
    });

    // Sıralama için başlıklara olay dinleyicileri ekle
    document.querySelectorAll('#userTable th[data-sort]').forEach(header => {
        header.addEventListener('click', () => sortTable(header.dataset.sort));
    });
}

async function updateUserAuthority(event) {
    const email = event.target.dataset.email;
    const authorityInput = document.querySelector(`input[data-email="${email}"]`);
    const newAuthority = authorityInput.value;

    try {
        const response = await fetch('/update-user-authority', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, authority: newAuthority }),
        });

        const result = await response.json();
        if (result.success) {
            alert('Yetki başarıyla güncellendi.');
        } else {
            alert('Yetki güncellenemedi.');
        }
    } catch (error) {
        console.error('Yetki güncellenirken hata oluştu:', error);
    }
}

async function deleteUser(event) {
    const email = event.target.dataset.email;

    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch('/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        if (result.success) {
            loadUserManagementContent(); // Tabloyu güncelle
        } else {
            alert('Kullanıcı silinemedi.');
        }
    } catch (error) {
        console.error('Kullanıcı silinirken hata oluştu:', error);
    }
}

function sortTable(sortKey) {
    const userTableBody = document.querySelector('#userTable tbody');
    const rows = Array.from(userTableBody.rows);

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${getColumnIndex(sortKey)})`).textContent;
        const bValue = b.querySelector(`td:nth-child(${getColumnIndex(sortKey)})`).textContent;

        if (sortKey === 'createDate' || sortKey === 'lastLoginDay') {
            return new Date(aValue) - new Date(bValue);
        } else if (sortKey === 'totalScore' || sortKey === 'streak' || sortKey === 'studiedTime') {
            return parseInt(bValue) - parseInt(aValue);
        } else {
            return aValue.localeCompare(bValue);
        }
    });

    userTableBody.innerHTML = '';
    rows.forEach(row => userTableBody.appendChild(row));
}

function getColumnIndex(sortKey) {
    const columns = {
        email: 1,
        username: 2,
        totalScore: 3,
        streak: 4,
        studiedTime: 5,
        createDate: 6,
        lastLoginDay: 7,
    };
    return columns[sortKey];
}

