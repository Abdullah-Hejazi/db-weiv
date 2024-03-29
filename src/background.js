'use strict'

import { app, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const ipcMain = require('electron').ipcMain;

const isDevelopment = process.env.NODE_ENV !== 'production'


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win = null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: process.env.WEBPACK_DEV_SERVER_URL,
        icon: __dirname + '/icon.png',
        title: 'DB Weiv - Database Viewer',
        webPreferences: {
            enableRemoteModule: true,

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        }
    })

    win.maximize()

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.webContents.setWindowOpenHandler(function(e) {
        require('electron').shell.openExternal(e.url);
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    createWindow()
})

app.whenReady().then(() => {
})

// open dialog
ipcMain.on('open-file', function (event, path) {
    let result = dialog.showOpenDialogSync({
        browserWindow: win,
        properties: ['openFile'],
        filters: [
            {
                name: 'Sql File',
                extensions: ['sql']
            }
        ]
    });

    event.returnValue = result
});

// open save file dialog
ipcMain.on('save-file', function (event, path) {
    let result = dialog.showSaveDialogSync({
        browserWindow: win,
        properties: ['openFile'],
        filters: [
            {
                name: 'Sql File',
                extensions: ['sql']
            }
        ]
    });

    event.returnValue = result
});


ipcMain.on('minimize-app', function (event, path) {
    win.minimize();
});

ipcMain.on('maximize-app', function (event, path) {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.on('close-app', function (event, path) {
    app.quit()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
