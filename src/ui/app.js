const remote = require("electron").remote
const configFileService = remote.require('./configFileService')
const notificationService = remote.require('./notificationService')
const model = remote.require('./model')

const userForm = document.querySelector("#userForm");
const userName = document.querySelector("#username");
const userEmail = document.querySelector("#email");
const usersList = document.querySelector("#users");

let users = [];
let editingStatus = false;
let editUserId;


const selectUser = async (id) => {
    const response = confirm("Are you sure you want to select this profile?");
    if (response) {
        const user = await model.getUserById(id);
        configFileService.writeCofigFile(user);
    }
    return;
}

const deleteUser = async (id) => {
    const response = confirm("Are you sure you want to delete it?");
    if (response) {
        await model.deleteUser(id, notificationService.notifyDeletedUser);
        await getUsers();
    }
    return;
};

const editUser = async (id) => {
    const user = await model.getUserById(id);
    console.log(user)
    userName.value = user['0'].user_name;
    userEmail.value = user['0'].email;

    editingStatus = true;
    editUserId = id;
    console.log("ID", editUserId)
};

userForm.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();

        const user = {
            userName: userName.value,
            email: userEmail.value,
        };

        if (!editingStatus) {
            await model.saveUser(user, "NULL", notificationService.notifyCreatedUser);
        } else {
            await model.saveUser(user, editUserId, notificationService.notifyUpdatedUser);

            // Reset
            editingStatus = false;
            editUserId = "";
        }

        userForm.reset();
        userName.focus();
        getUsers();
    } catch (error) {
        console.log(error);
    }
});

function renderUsers(users) {
    usersList.innerHTML = "";
    users.forEach((u) => {
        usersList.innerHTML += `
      <div class="card card-body my-2 animated fadeInLeft">
        <h4>${u.user_name}</h4>
        <p>${u.email}</p>
        <p>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.user_id}')">
          DELETE
        </button>
        <button class="btn btn-secondary btn-sm" onclick="editUser('${u.user_id}')">
          EDIT 
        </button>
        <button class="btn btn-primary btn-sm" onclick="selectUser('${u.user_id}')">
          SELECT
        </button>
        </p>
      </div>
    `;
    });
}

const getUsers = async () => {
    users = await model.getUsers()
    if (users) {
        const entries = Object.entries(users)
        usersArray = []
        entries.forEach((item) => {
            console.log(item['1'])
            usersArray.push(item['1'])
        })

        renderUsers(usersArray);
    }
    else {
        window.alert("No hay usuarios almacenados")
    }
};

async function init() {
    getUsers();
}

init();