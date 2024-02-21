import { app, shell, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'

class MainWindow {
  mainWindow: BrowserWindow | null

  constructor() {
    this.mainWindow = null
    this.createWindow()
    this.setupIpcListeners() // Set up IPC listeners
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 600,
      height: 600,
      show: false,
      autoHideMenuBar: true,
      icon: process.platform === 'linux' ? icon : undefined,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    this.mainWindow.removeMenu()
    this.mainWindow.on('ready-to-show', () => {
      if (this.mainWindow) {
        this.mainWindow.show()
        this.autoUpdateCheck()
      }
    })

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.mainWindow.loadURL(`file://${join(__dirname, '../renderer/index.html')}`)
    }
  }

  setupIpcListeners() {
    ipcMain.on('resize', (_, args) => {
      const { width, height } = args
      if (typeof width === 'number' && typeof height === 'number') {
        this.resizeWindow(width, height)
      }
    })
  }

  resizeWindow(width: number, height: number) {
    if (this.mainWindow) {
      this.mainWindow.setSize(width, height)
      this.mainWindow.center()
    }
  }

  autoUpdateCheck() {
    if (this.mainWindow) {
      if (is.dev) {
        this.mainWindow.webContents.send('auto-update', 'update-not-available')
        return
      }

      this.mainWindow.webContents.send('auto-update', 'checking-for-update')
      autoUpdater.checkForUpdatesAndNotify()

      autoUpdater.on('update-available', () => {
        if (this.mainWindow) {
          this.mainWindow.webContents.send('auto-update', 'update-available')
        }
      })

      autoUpdater.on('update-not-available', () => {
        if (this.mainWindow) {
          this.mainWindow.webContents.send('auto-update', 'update-not-available')
        }
      })

      autoUpdater.on('update-downloaded', () => {
        if (this.mainWindow) {
          this.mainWindow.webContents.send('auto-update', 'update-downloaded')

          setTimeout(() => {
            autoUpdater.quitAndInstall()
          }, 2000)
        }
      })

      autoUpdater.on('download-progress', (progress) => {
        if (this.mainWindow) {
          this.mainWindow.webContents.send('auto-update-progress', progress.percent.toFixed(2))
        }
      })

      autoUpdater.on('error', (error) => {
        if (this.mainWindow) {
          this.mainWindow.webContents.send('auto-update', `Update error: ${error.toString()}`)
        }
      })
    }
  }
}

let mainWindowInstance: MainWindow

app.whenReady().then(() => {
  electronApp.setAppUserModelId('masystent.app.firma_monkiewicz')
  mainWindowInstance = new MainWindow()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.openDevTools()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindowInstance.createWindow()
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
