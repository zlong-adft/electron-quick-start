// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { Worker, workerData, parentPort } = require('worker_threads');
const worker = new Worker(require.resolve("./worker.js"), { workerData: app.getPath('userData') });
const path = require('path')
var mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('main.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

worker.on('message', (msg) => {
  if (msg[0] == 'getOthers') {
    mainWindow.webContents.send('getOthers_return', msg[1]);
  }
})

ipcMain.on('newDoc', (event, value) => {
  worker.postMessage(['newDoc', value])
})

ipcMain.on('editDoc', (event, value) => {
  worker.postMessage(['editDoc', value])
})

ipcMain.on('getOthers', (event, value) => {
  worker.postMessage(['getOthers'])
})