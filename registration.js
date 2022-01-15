const usernameInput = document.getElementById("username-register");
const passwordInput = document.getElementById("password-register");
const confirmPasswordInput = document.getElementById("password-register-confirm");
const registrationInfo = document.getElementById("registration-info");
const loader = document.getElementById("loader")

const registerBtn = document.getElementById("register-confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");

function clearFields() {
    usernameInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
}

cancelBtn.addEventListener("click", clearFields);

let username, password;
let register

registerBtn.addEventListener("click", function(){

    let state = false;
    register = true;

    if(passwordInput.value === confirmPasswordInput.value) {
        username = usernameInput.value;
        password = passwordInput.value;
        state = true;
    }

    if(passwordInput.value !== confirmPasswordInput.value) {
        registrationInfo.textContent = "Password must match in both fields";
        state = false;
    }

    if(state) {
    
        loader.style.display = "inline-block";

        firebase.database().ref("reminderapp/").on("value", function(snapshot) {
            
            if(snapshot.val() === null) register = true;

            for (let userName in snapshot.val()) {

                if(userName === usernameInput.value) {
                    register = false; 
                    loader.style.display = "none";
                    registrationInfo.textContent = "Username has already been taken";
                    return;
                } 
            }

            loader.style.display = "none";

            if(register) {

                loader.style.display = "inline-block";
    
                firebase.database().ref("reminderapp/"+username).set({
                    username: username,
                    password: password,
                    reminders: {
                        0: {
                            Title: "init",
                            Priority: "init",
                            Color: "init",
                            Description: "init",
                            Id: 0
                        }
                    }
                }).then(e => {
                    registrationInfo.textContent = "Username added";
                    clearFields();
                    loader.style.display = "none";
                }).catch(error => {
                    registrationInfo.textContent = "There was an error";
                    console.log(error)
                })
               
            } 
            
        })

    }
})
