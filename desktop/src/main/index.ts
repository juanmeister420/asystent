import { app, shell, BrowserWindow, globalShortcut, ipcMain, Notification } from 'electron'
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

      resizable: false,

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
      this.mainWindow?.show()
      this.mainWindow?.focus()
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

    ipcMain.on('fullscreen', () => {
      this.mainWindow?.maximize()
      this.mainWindow?.setMinimumSize(800, 600)
      this.mainWindow?.setResizable(true)
    })

    if (is.dev) {
      ipcMain.on('auto-update-start', () => {
        this.mainWindow?.setResizable(false)

        this.mainWindow?.webContents.send('auto-update', 'update-not-available')
      })
      return
    }
    ipcMain.on('auto-update-start', () => {
      this.mainWindow?.webContents.send('auto-update', 'checking-for-update')
      autoUpdater.checkForUpdates()

      autoUpdater.on('update-available', () => {
        this.mainWindow?.webContents.send('auto-update', 'update-available')
      })

      autoUpdater.on('update-not-available', () => {
        this.mainWindow?.webContents.send('auto-update', 'update-not-available')
      })

      autoUpdater.on('update-downloaded', () => {
        let notification = new Notification({
          icon: icon,
          title: 'Aplikacja mAsystent została zaktualizowana!',
          body: 'Za chwilę zostanie zainstalowana nowa wersja aplikacji.'
        })
        notification.show()
        this.mainWindow?.webContents.send('auto-update', 'update-downloaded')

        setTimeout(() => {
          autoUpdater.quitAndInstall()
        }, 2000)
      })

      autoUpdater.on('download-progress', (progress) => {
        this.mainWindow?.webContents.send('auto-update-progress', progress.percent.toFixed(0))
      })

      autoUpdater.on('error', (error) => {
        this.mainWindow?.webContents.send('auto-update', `Update error: ${error.toString()}`)
      })
    })
  }

  resizeWindow(width: number, height: number) {
    this.mainWindow?.setSize(width, height)
    this.mainWindow?.center()
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
