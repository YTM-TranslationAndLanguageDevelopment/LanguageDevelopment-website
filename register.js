function submitRegistration() {
    const name = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Kayıt başarılı!") {
                 // Kullanıcı e-postasını localStorage'a kaydet
                localStorage.setItem("userEmail", email);
                alert(data.message);
                closePopup("kayitPopup");
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
        });
}