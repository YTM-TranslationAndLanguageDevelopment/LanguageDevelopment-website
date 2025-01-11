document.addEventListener('DOMContentLoaded', async () => {
    const pageName = document.body.getAttribute('data-page'); // Sayfa adını body'den al

    try {
        const response = await fetch(`/get-page-data/${pageName}`);
        if (response.ok) {
            const data = await response.json();
            document.body.style.backgroundColor = data.backgroundColor;
            document.body.style.color = data.color;
            document.body.style.fontSize = data.fontSize + 'px';
            document.querySelector('main').innerHTML = data.content;
            if (data.imageName) {
                document.body.style.backgroundImage = `url(/images/${data.imageName})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'repeat-y';
            }
        } else {
            console.error('Sayfa verileri alınamadı.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
});