const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu');
const { globalShortcut, Menu } = require('electron')

try {
    require('electron-reloader')(module);
} catch {}

const createWindow = (url, title) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      title: title,
      webPreferences: {
        spellcheck: true,
      }
    })
    win.setMenu(null)
    win.loadURL(url)
    win.webContents.on('new-window', (e, url) => {
      e.preventDefault()
      require('electron').shell.openExternal(url)
    })
    win.insertCSS(fs.readFileSync(path.join(__dirname, 'inject.css'), 'utf8'))
}

app.whenReady().then(() => {
    const template = [
      {
        label: 'Gmail',
        click: () => {
          createWindow('https://gmail.com')
        }
      },
      {
        label: 'URL',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'URL',
            message: 'Enter the URL you want to open',
            buttons: ['OK']
          })
        }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  })

  contextMenu({
    prepend: (defaultActions, parameters, browserWindow) => [
      {
        label: 'Exit',
        click: () => {
          app.quit();
        }
      },
    ]
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })