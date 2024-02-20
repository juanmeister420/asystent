import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    minWidth: 636,
    minHeight: 659,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.removeMenu()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    mainWindow.webContents.send('auto-update', 'Checking for updates...')

    autoUpdater.checkForUpdatesAndNotify()

    // Auto-update events
    autoUpdater.on('update-available', () => {
      mainWindow.webContents.send('auto-update', 'Update available. Downloading...')
    })

    autoUpdater.on('update-not-available', () => {
      mainWindow.webContents.send('auto-update', 'Current version is up-to-date.')
    })

    autoUpdater.on('update-downloaded', () => {
      mainWindow.webContents.send(
        'auto-update',
        'Update downloaded. It will be installed on restart.'
      )

      setTimeout(() => {
        autoUpdater.quitAndInstall()
      }, 3000)
    })

    autoUpdater.on('error', (error) => {
      mainWindow.webContents.send('auto-update', `Update error: ${error.toString()}`)
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('masystent.app.firma_monkiewicz')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
