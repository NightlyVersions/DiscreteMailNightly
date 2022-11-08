const { app, BrowserWindow } = require('electron')
const contextMenu = require('electron-context-menu');

try {
	require('electron-reloader')(module);
} catch {}

const createWindow = (url) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
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
    createWindow('https://gmail.com')
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