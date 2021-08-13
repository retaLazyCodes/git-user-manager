const electron = require('electron')
const path = require('path')
const lineByLine = require('n-readlines');
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

const readCofigFile = () => {
    const configFilePath = app.getPath('home') + '/.gitconfig'
    const liner = new lineByLine(configFilePath);

    let line = true
    let email = ""
    let name = ""
    let userConfig
    while (line = liner.next()) {
        line = line.toString('ascii')
        line = line.trim()
        if (line.startsWith("email")) {
            let splittedLine = line.split(" ")
            email = splittedLine[2]
        }
        if (line.startsWith("name")) {
            let splittedLine = line.split(" ")
            name = splittedLine[2]
            console.log(name)
        }
    }
    userConfig = { email: email, userName: name }
    return userConfig

    // lineReader.eachLine(configFilePath, function (line) {
    //     line = line.trim()
    //     if (line.startsWith("email")) {
    //         let splittedLine = line.split(" ")
    //         email = splittedLine[2]
    //     }
    //     if (line.startsWith("name")) {
    //         let splittedLine = line.split(" ")
    //         name = splittedLine[2]
    //         console.log(name)
    //     }

    // }), (function (err) {
    //     if (err) throw err;
    //     userConfig = { email: email, userName: name }
    //     return userConfig
    // })
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
    console.log(app.getPath('userData'))
    model.initDb(app.getPath('userData'),
        window.loadFile(path.join(__dirname, 'ui/index.html')),
        readCofigFile
    )
}


module.exports = {
    createWindow,
    notifyCreatedUser,
    notifyUpdatedUser,
    notifyDeletedUser,
    readCofigFile
};