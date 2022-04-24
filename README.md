## GIT User Manager

Git User Manager

## Table of contents

- [General info](#general-info)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [How to run](#how-to-run)
- [Contact](#contact)

## General info

An Electron.js app to manage multiple GIT local users. Switch between them quickly.

## Screenshots

![project screenshot](./src/ui/assets/capture.png)

## Technologies

- Html
- Css
- Javascript
- Node.js
- Electron.js
- SQLite

## How to run

Note: You have to have [GIT](https://git-scm.com) installed on your computer 

1. Install [Node.js](https://nodejs.org/) v14+ to run.
2. Clone the repository
3. Open a terminal and navigate to the root project folder
4. Now run ```npm install``` to install all dependencies
5. Finally run ```npm start``` to run the app

## How to build and install on your OS

1. After having executed ```npm install``` you must run ```npm run make```
2. (only for Linux users) If you get the following error 
    ```Error: Cannot make for rpm, the following external binaries need to be installed: rpmbuild```
    ```Electron Forge was terminated. Location: {}```
    You can fix it running
    ```sudo apt install rpm```
3. Finally you will see a new folder called **out** with the generated redistributables ready to install the app on your OS.

## Contact

Created by [@retaLazyCodes](https://github.com/retaLazyCodes) - feel free to contact me!
