document.addEventListener('DOMContentLoaded', async function() {
    const userData = localStorage.getItem("user");

    console.log("Данни в localStorage: ", userData);
    if(!userData){
        window.location.href = "index.html";
        return;
    }


    const user = JSON.parse(userData);
    const displayUsername = document.getElementById("display-username");
    if(displayUsername){
        displayUsername.textContent = user.username;
    }
    
    async function FetchLatestBalance(){
        try{
            const response = await fetch(`http://localhost:3000/get-balance/${user.username}`);
            const data = await response.json();

            const balanceEl = document.getElementById("balance");

            if(balanceEl){
                balanceEl.textContent = parseFloat(data.balance).toFixed(2);
            }
        } catch (err) {
            console.error("Грешка при намиране на баланса:", err);
        }
    }
    FetchLatestBalance();

    //Обноявяване на баланса
 async function UpdateMainBalance() {
  try{
        const response = await fetch(`http://localhost:3000//get-balance/${user.username}`);
        const data = await response.json();
        document.getElementById("balance").textContent = parseFloat(data.balance).toFixed(2);

        if(response.ok){
            //Показваме баланса в съответния момент
            const balanceEl = document.getElementById("balance");
            if(balanceEl){
                balanceEl.textContent = parseFloat(data.balance).toFixed(2) +  " €."
            }
        }
    } catch (err) {
        console.error("Грешка при баланса на началната страница");
    }
 }
   

    //Изход - LOGOUT

    document.getElementById("logout-Btn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
    });

    UpdateMainBalance();
    
});