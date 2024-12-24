function submitLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Giriş başarılı!") {
                // Kullanıcı e-postasını localStorage'a kaydet
                localStorage.setItem("userEmail", email);

                alert(data.message);
                closePopup("girisPopup");
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
        });
}