const { app } = require("electron")
const lineByLine = require('n-readlines');
const path = require('path')
const notification = require(path.join(__dirname, './notificationService.js'))
const { execSync } = require('child_process');

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

const writeCofigFile = (userRow) => {
    console.log(userRow)
    const user = userRow['0']
    const { user_name, email } = user
    const setEmail = `git config --global user.email ${email.trim()}`
    const setName = `git config --global user.name "${user_name.trim()}"`
    execSync(setEmail)
    execSync(setName)

    notification.notifySeletedUser(user_name)
}

const getUserConfig = () => {
    const getUserName = "whoami"
    const userName = execSync(getUserName).toString()
    const gitConfig = readCofigFile()
    return { userName, gitConfig }
}

module.exports = {
    readCofigFile,
    writeCofigFile,
    getUserConfig,
}