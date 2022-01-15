const titleInput = document.getElementById("title");
const priorityInput = document.getElementById("priority");
const colorInput = document.getElementById("color");
const descriptionInput = document.getElementById("description");
const tableHook = document.getElementById("table-hook");
const h1 = document.getElementById("h1");
const h4 = document.getElementById("h4")
const main = document.getElementById("main")
const notLogged = document.getElementById("not-logged");
const loader = document.getElementById("loader");

const ul = document.getElementById("ul");
const loginLi = document.getElementById("login");
const registerLi = document.getElementById("register");
const homeLi = document.getElementById("index");

const table = document.createElement("table");
table.id = "tbl";
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");
table.appendChild(thead)

const addReminderBtn = document.getElementById("add-reminder-btn");
const showRemindersBtn = document.getElementById("show-reminders");
const updateReminderBtn = document.getElementById("update-reminder-btn");

let id;
let updateId;

window.onload = function() {

    if(sessionStorage.getItem("username") !== null) {
        main.style.display = "block"
        notLogged.style.display = "none";
        firebase.database().ref("reminderapp/"+sessionStorage.getItem("username")+"/reminders/").on("value", function(snapshot) {
            id = Object.keys(snapshot.val());
            id = parseInt(id[id.length - 1]) + 1;
        })  
    }

    updateReminderBtn.style.display = "none";
}

const remindersProps = ["N.","Title", "Priority", "Description", "Update", "Delete"]
remindersProps.forEach(e => {
    let th = document.createElement("th");
    th.innerText = e
    th.classList.add("td")
    thead.appendChild(th)
});

if(sessionStorage.getItem("username")) {

    const li = document.createElement("li");
    const a = document.createElement("a");
    li.append(a);
    a.innerText = sessionStorage.getItem("username");
    a.setAttribute("href", "index.html");
    li.classList.add("active");
    ul.append(li);
    loginLi.style.display = "none";
    registerLi.style.display = "none";
    homeLi.style.display = "none";

    const logOutLi = document.createElement("li");
    const logOutA = document.createElement("a");
    logOutLi.append(logOutA);
    logOutA.setAttribute("href", "")
    logOutA.addEventListener("click", () => {
        sessionStorage.clear();
    })
    logOutA.innerText = "Log Out";
    ul.append(logOutLi);
}

addReminderBtn.addEventListener("click", function(){ 

    loader.style.display = "inline-block";

    firebase.database().ref("reminderapp/"+sessionStorage.getItem("username")+"/reminders/"+id).set({
        Id: id,
        Title: titleInput.value,
        Priority: priorityInput.value,
        Color: colorInput.value,
        Description: descriptionInput.value
    }).then(e => {
        loader.style.display = "none";
        h4.textContent = "Reminder has been stored!";
        titleInput.value = "";
        priorityInput.value = "high-priority";
        colorInput.value = "red";
        descriptionInput.value = "";
        setTimeout(() => {
            h4.textContent = "";
        }, 10000);
    }).catch(error => {
        h4.innerText = `There was an error`;
        console.log(error);
    });

})

showRemindersBtn.addEventListener("click", async () => {

    loader.style.display = "inline-block";

    firebase.database().ref("reminderapp/"+sessionStorage.getItem("username")+"/reminders/").on("value", function(snapshot) {
        
        let arr = [];

        for (const key in snapshot.val()) {
                let innerObj = {};
                innerObj[key] = snapshot.val()[key];

                arr.push(innerObj[key]);
        }


        if(arr.length >= 1) {

            tbody.innerHTML = "";

            let i = 1;

            for (const reminder of arr) {

                if(reminder.Id !== 0) {
                    let tr = document.createElement("tr");
                    tr.classList.add("tr");
        
                    let id = document.createElement("td");
                    id.innerText = i + ".";
                    tr.append(id);
        
                    let title = document.createElement("td");
                    title.style.color = reminder.Color;
                    title.innerText = reminder.Title;
                    
        
                    let priority = document.createElement("td");
                    priority.innerText = reminder.Priority;
                    
        
                    let description = document.createElement("td");
                    description.innerText = reminder.Description;
    
                    let update = document.createElement("td");
                    let updateBtn = document.createElement("button");
                    update.append(updateBtn);
                    updateBtn.innerText = "Update";
                    updateBtn.addEventListener("click", () => {
                        firebase.database().ref("reminderapp/"+sessionStorage.getItem("username")+"/reminders/"+reminder.Id).on("value", function(snapshot) {
                            titleInput.value = reminder.Title
                            priorityInput.value = reminder.Priority
                            colorInput.value = reminder.Color
                            descriptionInput.value = reminder.Description;
                            addReminderBtn.style.display = "none";
                            updateReminderBtn.style.display = "inline-block";
                            updateId = reminder.Id;
                        })
                    })
                    
                    let deleteCell = document.createElement("td");
                    let deleteBtn = document.createElement("button");
                    deleteCell.append(deleteBtn);
                    deleteBtn.innerText = "Delete";
                    deleteBtn.addEventListener("click", () => {
                        loader.style.display = "block";
                        firebase.database().ref("reminderapp/"+sessionStorage.getItem("username")+"/reminders/"+reminder.Id).remove();
                        loader.style.display = "none";
                        h4.innerText = `Note has been deleted!`;
                    })
        
                    if(i % 2 === 0) {
                        id.classList.add("td");
                        title.classList.add("td"); 
                        priority.classList.add("td");
                        description.classList.add("td");
                    }
        
                    tr.append(title, priority, description, update, deleteCell)
        
                    tbody.append(tr);
                    i++;
                    table.append(tbody)
                    tableHook.append(table)

                    loader.style.display = "none";
                } 

                if(arr.length <= 1) {

                    h4.innerText = "You don't have any reminders!";
                    loader.style.display = "none";

                }
                
            }

        } else {
            h4.innerText = "You don't have any reminders!";
        }
        
    })

})

updateReminderBtn.addEventListener("click", () => {

    loader.style.display = "inline-block";
    table.style.display = "none";

    firebase.database().ref("reminderapp/"+sessionStorage.getItem("username")+"/reminders/"+updateId).update({
        Title: titleInput.value,
        Priority: priorityInput.value,
        Color: colorInput.value,
        Description: descriptionInput.value
    }).then(e => {
        loader.style.display = "none";
        table.style.display = "block";
        h4.textContent = "Reminder has been updated!";
        titleInput.value = "";
        priorityInput.value = "high-priority";
        colorInput.value = "red";
        descriptionInput.value = "";
    
        addReminderBtn.style.display = "inline-block";
        updateReminderBtn.style.display = "none";
        setTimeout(() => {
            h4.textContent = "";
        }, 10000);
    }).catch(error => {
        h4.innerText = `There was an error`;
        console.log(error);
    });

})