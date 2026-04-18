 document.addEventListener("DOMContentLoaded", function(){

//Регистрационен формуляр

    const passwordInput = document.getElementById("reg-password");

    const confirmInput = document.getElementById("reg-confirmPassword");

    const strengthText = document.getElementById("reg-passwordStrength");

    const errorText = document.getElementById("reg-passwordError");

    const registerForm = document.getElementById("registerForm");

    const submitBtn = document.getElementById("reg-submitBtn");


//Функция getStrength проверява колко е силна паролата

    function getStrength(pass){

        let score = 0;

        if(pass.length >= 6) score++;

        if(/[A-Z]/.test(pass)) score++;

        if(/[0-9]/.test(pass)) score++;

        if(/[^A-Za-z0-9]/.test(pass)) score++;


        strengthText.className = "strength";

        if(!pass){

            strengthText.textContent = "";

            return "none";

        }


        if(score <= 1){

            strengthText.textContent = "Слаба парола";

            strengthText.classList.add("weak");

            return "weak";

        }


        else if(score <= 3){

            strengthText.textContent = "Средна парола";

            strengthText.classList.add("medium");

            return "medium";

        } else{

            strengthText.textContent = "Силна парола";

            strengthText.classList.add("strong");

            return "strong";

        }

    }
    const userData = localStorage.getItem("user");
    if (userData) {
        const user = JSON.parse(userData);
        const usernameDisplay = document.getElementById("display-username");
        const balanceDisplay = document.getElementById("balance");

        if (usernameDisplay) usernameDisplay.textContent = user.username;

        if (balanceDisplay) {

            (async () => {
            try {
                const response = await fetch(`http://localhost:3000/get-balance/${user.username}`);
                const data = await response.json();
                if (data.balance !== undefined) {
                    balanceDisplay.textContent = parseFloat(data.balance).toFixed(2);
                }
            } catch (err) {
                console.error("Грешка при връзка със сървъра за баланс.");
            }
            })();
           
        }
    }


    //Потвърждение/Валидиране на регистъра

function ValidateRegister(){

        const pass = passwordInput.value;

        const confirm = confirmInput.value;

        const strength = getStrength(pass);


        submitBtn.disabled = true;

        errorText.textContent = "";


        if(strength === "strong" && pass === confirm){

            submitBtn.disabled = false;

        } else if(pass && confirm && pass !== confirm) {

            errorText.textContent = "Паролите не съвпадат";

        }

    }


    if(passwordInput && confirmInput){

        passwordInput.addEventListener("input", ValidateRegister);

        confirmInput.addEventListener("input", ValidateRegister);

    }



    registerForm.addEventListener("submit", async function(e) {

        e.preventDefault();


        const username = document.getElementById("reg-username").value;

        const email = document.getElementById("reg-email").value;

        const password = passwordInput.value;

//Тук програмата взема потребителското име, имейла и паролата за да изпрати код за потвърждение на регистрацията

        try {

            const response = await fetch('http://localhost:3000/register', {

                method: "POST",

                headers: {'Content-Type': 'application/json'},

                body: JSON.stringify({username, email, password})

            });



                alert("Регистрацията е успешна! Провери имейла си за код");

                window.location.href = "verify.html";



        } catch (err){

            console.log("Малко забавяне в мрежата, но профилът се създава...");

            console.log("Възникна грешка в сървъра или имейла, който сте въвели вече е въведен!")

            alert("Имейла, който се въвели вече е въведен!");

        }


        //Взимаме обекта на потребителя от локалната памет

        const userData = localStorage.getItem("user");

       

        if(userData){

            const user = JSON.parse(userData);

            const usernameElement = document.getElementById("display-username");


            if(usernameElement){

                usernameElement.textContent = user.username;

            }

        } else{

            //Ако няма данни за потребител, го връщаме при логин страницата

            window.location.href = "index.html";

         }

    });



    const loginForm = document.getElementById("sign-In");


    if(loginForm) {

        loginForm.addEventListener("submit", async function(e) {

            e.preventDefault();


            const username = document.getElementById("login-username").value;

            const password = document.getElementById("login-password").value;

            const loginError = document.getElementById("login-error");


            try {

                const response = await fetch('http://localhost:3000/login', {

                    method: 'POST',

                    headers: {'Content-Type': 'application/json'},

                    body: JSON.stringify({username, password})

                });


                const result = await response.json();


                if(response.ok) {

                    localStorage.setItem("user", JSON.stringify(result.user));

                    localStorage.setItem("loggedIn", "true");

                    alert("Успешен вход!");


                    window.location.href = "mainPage.html";

                } else {

                    loginError.textContent = result.error || "Грешка при вход";

                    loginError.style.color = "red";

                }

            } catch (err) {

                loginError.textContent = "Сървърът не работи!";

                console.error(err);

            }

        });

    }

   

   

       

}) 