document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("verifyForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const email = document.getElementById("verify-email").value;
        const code = document.getElementById("verify-code").value;
        const message = document.getElementById("verify-message");
//Потвърждение и активиране на профила в платформата
        try {
            const response = await fetch('http://localhost:3000/verify', {
                method: "POST",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({email, code})
            });

            const result = await response.json();

            //Тук се прави проверка дали профилът на потребителят се е активирал успешно в платформата ако не е - Няма връзка със сървъра или не е въвел правилно изисканите от него данни!
            if (response.ok) {
                alert("Успешно активиране! Вече можеш да влезеш.");
                localStorage.setItem("user", JSON.stringify(result.user));
                window.location.href = "mainPage.html";
            } else {
                message.textContent = result.error || "Невалиден код";
                message.style.color = "red";
            }
        } catch (err) {
            message.textContent = "Няма връзка със сървъра.";
        }
    });
});