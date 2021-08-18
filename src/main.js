const electron = require('electron')
const path = require('path')
const model = require(path.join(__dirname, './model.js'))
const { readCofigFile } = require(path.join(__dirname, 'configFileService.js'))
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let window;

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
        window.loadFile(path.join(__dirname, 'ui/index.html')),
        readCofigFile
    )
}


module.exports = {
    createWindow,
};