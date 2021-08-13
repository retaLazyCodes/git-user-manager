const electron = require('electron')
const path = require('path')
const fs = require('fs')
const lineByLine = require('n-readlines');
const model = require(path.join(__dirname, './model.js'))
const notification = require(path.join(__dirname, './notificationService.js'))
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let window;

const readCofigFile = (fromWrite) => {
    const configFilePath = app.getPath('home') + '/.gitconfig'
    const liner = new lineByLine(configFilePath);

    let line
    let lines = ""
    let email = ""
    let name = ""
    while (line = liner.next()) {
        line = line.toString('ascii')
        lines += line
        line = line.trim()
        if (line.startsWith("email")) {
            let splittedLine = line.split(" ")
            email = splittedLine[2]
        }
        if (line.startsWith("name")) {
            let splittedLine = line.split(" ")
            const splitLength = splittedLine.length
            for (let i = 2; i < splitLength; i++) {
                name += splittedLine[i] + " "
            }
        }
    }
    if (fromWrite) {
        return lines
    }
    const userConfig = { email: email, userName: name }
    return userConfig
}

const writeCofigFile = (user) => {
    const configFilePath = app.getPath('home') + '/.gitconfig'
    const liner = new lineByLine(configFilePath);

    let line
    let lines = ""
    console.log(user['0'].user_name)
    while (line = liner.next()) {
        line = line.toString('ascii')
        line = line.trim()
        if (!line.startsWith("[")) {
            lines += "\t"
        }
        if (line.startsWith("email")) {
            let splittedLine = line.split(" ")
            splittedLine[2] = user['0'].email
            lines += splittedLine.join(' ')
        }
        else if (line.startsWith("name")) {
            let splittedLine = line.split(" ")
            console.log(splittedLine)
            splittedLine.splice(2, 0, user['0'].user_name)
            lines += `${splittedLine[0]} ${splittedLine[1]} ${splittedLine[2]}`
        }
        else {
            lines += line
        }
        lines += "\r\n"
    }
    console.log("----- LINEAS -----")
    console.log(lines)


    fs.writeFileSync(configFilePath, lines, {
        encoding: 'utf8',
        flag: 'w'
    })

    notification.notifySeletedUser(user['0'].user_name)
}

function createWindow() {
    window = new BrowserWindow({
        width: 810,
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
    readCofigFile,
    writeCofigFile
};