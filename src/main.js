const electron = require('electron')
const path = require('path')
const model = require(path.join(__dirname, './model.js'))
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Notification = electron.Notification

let window;

const notifyCreatedUser = async () => {
    // Notify the User
    new Notification({
        title: "Git User Manager",
        body: "New User Created Successfully",
    }).show();
}

const notifyUpdatedUser = async () => {
    new Notification({
        title: "Git User Manager",
        body: "User data Updated Successfully",
    }).show();
}

const notifyDeletedUser = async () => {
    new Notification({
        title: "Git User Manager",
        body: "User Deleted Successfully",
    }).show();
}


function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });
    model.initDb(app.getPath('userData'),
        window.loadFile(path.join(__dirname, 'ui/index.html'))
    )
}


module.exports = {
    createWindow,
    notifyCreatedUser,
    notifyUpdatedUser,
    notifyDeletedUser
};