document.addEventListener('DOMContentLoaded', async function() {
    let totalTime = 15;
    let timeInterval;
    let isTimerStarted = false;

    function startGlobalTimer(){
        if(isTimerStarted){
            return;
        }
        isTimerStarted = true;

        const timerDisplay = document.getElementById("timer");

        timeInterval = setInterval(() => {
            totalTime--;
            timerDisplay.textContent = totalTime;


            //Визуално предупреждение ако остават малко секунди
            if(totalTime <= 10){
                timerDisplay.style.color = "red";
            }

            if(totalTime <= 0){
                clearInterval(timeInterval);
                setTimeout(() => {
                gameOver("Времето изтече!");
                }, 100);
          
            }
        }, 1000);
    }

    function gameOver(message){
        alert(message);
        window.location.href = "mainPage.html";
    }

    const userData = localStorage.getItem("user");
    if(!userData){
        window.location.href = "index.html";
        return;
    }

    const user = JSON.parse(userData);

    //Показване на името и баланса
    document.getElementById("user-name").textContent = user.username;

    async function RefreshBalance(){
        try {
            const response = await fetch(`http://localhost:3000/get-balance/${user.username}`);
            const data = await response.json();
            document.getElementById("user-balance").textContent = parseFloat(data.balance).toFixed(2);
        } catch(err){
            console.error("Грешка при баланса");
        }
    }

    await RefreshBalance();

    const questions = [
    {q: "Кога е създадена българската държава?", a: ["681", "796", "1785", "1995"], correct: 0},
    {q: "Колко е 6х6?", a:["95", "12", "36", "42"], correct: 2},
    {q: "На кой полуостров се намира България?", a: ["Арабски", "Балкански", "Пиренейски", "Апенински"], correct: 1},
    {q: "С кои държави граничи България?", a: ["Англия-Русия-Франция-Северна Корея-Япония", "Украйна-Беларус-Люксембург-Молдова-Узбекистан", "Белгия-Дания-Естония-Ирландия-Кипър", "Турция-Румъния-Гърция-Северна Македония-Сърбия"], correct: 3},
    {q: "Със какво е известен българския цар Симеон Велики?", a: ["Починал е от инфаркт, когато е видял ослепялата си войска", "Известен е като хана Строител", "Известен е със своя златен век", "Изковал си е чаша от черепа на Никифор I Геник"], correct: 2},
    {q: "Със какво е известен Майкъл Джексън?", a: ["Лунната походка", "Със песента си Self-Control", "Участвал е във филма 'Роки'", "Известен е със факта, че е бивш боксьор"], correct: 0},
    {q: "От коя държава произлиза пастата?", a:["Ирландия", "Италия", "Малта", "Гърция"], correct: 1},
    {q: "Кой е създателят на Фейсбук?", a:["Роджър Федерер", "Бил Гейтс", "Джеф Безос", "Марк Зукърбърг"], correct: 3},
    {q: "Какво е професията на Брад Пит?", a:["Футболист", "Актьор", "Бизнесмен", "Музикант"], correct: 1},
    {q: "Кой е най-известният футболист в историята?", a:["Кристиано Роналдо", "Лионел Меси", "Неймар Джуниър", "Пеле"], correct: 3},
    {q: "Koй е естественият спътник на Земята?", a:["Сатурн", "Нептун", "Луната", "Слънцето"], correct: 2},
    {q: "Кой е първият човек стъпил на луната?", a:["Нийл Армстронг", "Илън Мъск", "Никълъс Кейдж", "Джейсън Стейтъм"], correct: 0},
    {q: "Кой е актьорът изиграл главния герой Нео във филма 'Матрицата'", a:["Лоурънс Фишбърн", "Киану Рийвс", "Том Ханкс", "Самюъл Л. Джаксън"], correct: 1},
    {q: "Кой от изредените певци е българин?", a:["Никос Вертис", "Дара", "Тейлър Суифт", "Лепа Брена"], correct: 1},
    {q: "Кой е написал 'История Славянобългарска'?", a:["Иван Вазов", "Александър Пушкин", "Фьодор Достоевски", "Паисий Хилендарски"], correct: 3},

];

let currentIdx = 0;


//Функция за зареждане на въпрос

function loadQuestion(){
    const questionEl = document.getElementById("question");
    const optionContainer = document.getElementById("options-container");

    if(currentIdx >= questions.length){
        clearInterval(timeInterval);
        questionEl.textContent = "Поздравления! Преминахте нивото!";
        optionContainer.innerHTML = '<button onclick="window.location.href = \'mainPage.html\'">към менюто</button';

        return;
    }

    document.getElementById("timer").textContent = totalTime;
    //Стартираме таймера само ако още не е тръгнал
    startGlobalTimer();

    const currentQuestion = questions[currentIdx];
    questionEl.textContent = currentQuestion.q;
    optionContainer.innerHTML = "";

    currentQuestion.a.forEach((option, index) => {

        
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.className = "option-btn";
        btn.onclick = () => checkAnswer(index);
        optionContainer.appendChild(btn);
    });
}


async function checkAnswer(selectedIdx){
    const correctAnswer = questions[currentIdx].correct;


    if(selectedIdx === correctAnswer){
        alert("Верен отговор! Печелите 3.00 €.");

         try{
        const response = await fetch('http://localhost:3000/update-balance', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: user.username, amount: 3})
        });

        if(response.ok){
            await RefreshBalance();
            alert("Балансът е обновен успешно!");
        }
 
    } catch (err) {
        console.error("Грешка при обновяване на баланса");
    }


    } else{
        alert("Грешен отговор! Опитайте пак.");
    }

    currentIdx++;
    loadQuestion();
} 

 loadQuestion();
});