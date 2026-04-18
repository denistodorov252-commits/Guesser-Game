document.addEventListener('DOMContentLoaded', function(){
    const passwordInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirmPassword");
    const strengthText = document.getElementById("reg-passwordStrength");
    const errorText = document.getElementById("reg-passwordError");
    const submitBtn = document.getElementById("reg-submitBtn");

    //Логиката за сила на паролата
    function getStrength(pass){
        let score = 0;
        if(pass.length >= 6) score++;
        if(/[A-Z]/.test(pass)) score++;
        if(/[0-9]/.test(pass)) score++;
        if(/[^A-Za-z0-9]/.test(pass)) score++;

        if(!pass){
            strengthText.textContent = "";
            return "none";
        }
        if(score <= 1){
            strengthText.textContent = "Слаба парола";
            strengthText.style.color = "red";
            return "weak";
        } else if(score <= 3){
            strengthText.textContent = "Средна парола";
            strengthText.style.color = "yellow";
            return "medium";
        }
        else{
            strengthText.textContent = "Силна парола";
            strengthText.style.color = "lightgreen";
            return "strong";
        }
    }

    function ValidateRegister(){
        const pass = passwordInput.value;
        const confirm = confirmInput.value;
        const strength = getStrength(pass);

        submitBtn.disabled = true;
        if(strength === "strong" && pass === confirm && pass !== ""){
            submitBtn.disabled = false;
            errorText.textContent = "";
        } else if(pass && confirm && pass !== confirm){
            errorText.textContent = "Паролите не съвпадат";
        }
    }

    if(passwordInput){
        passwordInput.addEventListener("input", ValidateRegister);
        confirmInput.addEventListener("input", ValidateRegister);
    }

    //Регистрация
    document.getElementById("registerForm")?.addEventListener("submit", async function(e){
        e.preventDefault();

        localStorage.clear();
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:3000/register', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, email, password})
        });
        if(response.ok){
        const result = await response.json();
        alert("Получихте код! Проверете имейла си.");
        localStorage.setItem("pendingEmail", email);
        window.location.href = "verify.html";
       } else {
        const errorData = await response.json();
        alert("Проблем при регистриране" + (errorData.message || errorData.error));
       }

    } catch (err) {
        console.error("Грешка при връзка със сървъра", err);
        alert("Сървърът не е стартиран");
    }    
 });
    //Вход - ЛОГИН
    document.getElementById("sign-In")?.addEventListener("submit", async function(e){
        e.preventDefault();

        const loginUsername = document.getElementById("login-username").value;
        const loginPassword = document.getElementById("login-password").value;
        const response = await fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: loginUsername, password: loginPassword})
        });

        const result = await response.json();
        if(response.ok){
            alert("Добре дошли!");
            localStorage.setItem("user", JSON.stringify(result.user));
            window.location.href = "mainPage.html";
        } else {
            alert(result.error);
        }
    });
        
});
