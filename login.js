const usernameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");
const h1 = document.getElementById("login-info");
const ul = document.getElementById("ul");

const logInBtn = document.getElementById("login-confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");

function clearFields() {
    usernameLogin.value = "";
    passwordLogin.value = "";
}

cancelBtn.addEventListener("click", clearFields)

logInBtn.addEventListener("click", () => {
    let usernameMatch = false;
    firebase.database().ref("reminderapp/").on("value", function(snapshot) {
        for (let username in snapshot.val()) {
            if(username === usernameLogin.value) {
               usernameMatch = true;break;
            } else {
                usernameMatch = false;
            }
        }
        if(usernameMatch) {
            firebase.database().ref("reminderapp/"+usernameLogin.value).on("value", function(snapshot) {
                if(usernameLogin.value === snapshot.val().username && passwordLogin.value === snapshot.val().password) {
                    location.href="index.html";
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    li.append(a);
                    sessionStorage.setItem("username", snapshot.val().username);
                    a.innerText = sessionStorage.getItem("username");
                    ul.append(li);
                } else {
                    h1.textContent = "Incorrect username or password!";
                    clearFields();
                }
            })
        } else {
            h1.textContent = "Incorrect username or password!"
            clearFields()
        }
    }) 
})