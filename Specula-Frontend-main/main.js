const { webContents } = require("electron")
const electron = require("electron")
const fs = require("fs")
const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    Menu
} = electron
let token
let win
let filePath = undefined
app.on('ready', () => {
    console.log('app is ready')
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,

        },
    })
    win.loadFile('htmlFiles/index.html')
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    win.webContents.send('asynchronous-message', 'pong')
    
  
})

ipcMain.on('roomName', (event, arg) => {
    console.log(arg)    
    win.webContents.on('did-finish-load', function () {
        win.webContents.send('roomInformation', arg);
    });
    
   win.loadFile('htmlFiles/chatroom.html')
})


ipcMain.on('save', (event, text1) => {

    if (filePath === undefined) {
        dialog.showSaveDialog(win, {
            defaultPath: "filename.txt"
        }).then(result => {
            let result1 = result.filePath
            if (result1) {
                console.log(text1)
                filePath = result1
                fs.writeFile(result1, text1, (err) => {
                    if (err) console.log('there was an error', err)
                    console.log('file has been saved')
                    win.webContents.send('saved', 'success')
                })
            }

        })
    }


});
ipcMain.on('LoadStudentLogin', (event) => {
    
    win.loadFile('htmlFiles/StudentLogin.html')
   
})

ipcMain.on('chatroom', (event) => {
    
    win.loadFile('htmlFiles/chatroom.html')
   
})

ipcMain.on('LoadProfessorLogin', (event) => {
    win.loadFile('htmlFiles/ProfessorLogin.html')
})

ipcMain.on('RoomCreation', (event) => {
    win.loadFile('htmlFiles/CreateRoom.html')
})
ipcMain.on('RoomLogin', (event) => {
    win.loadFile('htmlFiles/RoomLogin.html')
})
ipcMain.on('StudentRoomDisplay', (event) => {
    win.loadFile('htmlFiles/StudentRoomDisplay.html')
})

ipcMain.on("window-all-closed", (event) => {

    app.quit();

});
ipcMain.on('checkpostrequest', (event, data)=>{
    console.log(data)
});
ipcMain.on('axiosresponse', (event, data)=>{
    console.log(data)
    token = data
    console.log(token)

});


/*const menuTemplate = [

    {
        label: "File",
        submenu: [{
                label: "Save",
                click() {
                    win.webContents.send('save-clicked')
                }
            },
            {
                label: "Save As",
                click() {
                    console.log("save as from menu")
                }
            }
        ]
    },
    {
        role: 'editMenu'
    }
]*/