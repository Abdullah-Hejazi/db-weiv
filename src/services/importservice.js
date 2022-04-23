const { ipcRenderer } = require('electron')

export default {
    load () {
        let sqlfile = ipcRenderer.sendSync('open-file')

        
    }
}