import { contextBridge, ipcRenderer } from 'electron'

// Define a secure API to expose to the renderer process
const secureApi = {
  send: (channel, data) => {
    // List of channels you allow the renderer process to send messages to
    const validChannels = ['resize', 'auto-update-start', 'fullscreen']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    // List of channels you allow the renderer process to receive messages from
    const validChannels = ['auto-update', 'auto-update-progress', 'resize', 'auto-update-start']
    if (validChannels.includes(channel)) {
      // Remove existing listener to avoid duplicates
      ipcRenderer.removeAllListeners(channel)
      // @ts-ignore
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func)
  }
}

contextBridge.exposeInMainWorld('api', secureApi)
