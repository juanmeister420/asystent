import { app, shell, BrowserWindow, globalShortcut } from 'electron'
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

    mainWindow.webContents.send('auto-update', 'checking-for-update')

    autoUpdater.checkForUpdatesAndNotify()

    // Auto-update events
    autoUpdater.on('update-available', () => {
      mainWindow.webContents.send('auto-update', 'update-available')
    })

    autoUpdater.on('update-not-available', () => {
      mainWindow.webContents.send('auto-update', 'update-not-available')
    })

    autoUpdater.on('update-downloaded', () => {
      mainWindow.webContents.send('auto-update', 'update-downloaded')

      setTimeout(() => {
        autoUpdater.quitAndInstall()
      }, 2000)
    })

    autoUpdater.on('download-progress', (progress) => {
      mainWindow.webContents.send('auto-update-progress', progress.percent.toFixed(2))
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
    mainWindow.loadURL(`file://${join(__dirname, '../renderer/index.html')}`)
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('masystent.app.firma_monkiewicz')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.openDevTools()
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
