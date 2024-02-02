const { contextBridge, ipcRenderer } = require('electron/renderer')

/*
* sendPathToMain - функция для вызова в renderer.js | (pathToFile) - аргумент, который принимает функция
* ipcRenderer.invoke() - вызывается мост из Рендера, invoke() - после отправки запроса получает ответ
* 'get-path' - функция для вызова в main.js | pathToFile - аргумент, который принимает функция
*/
contextBridge.exposeInMainWorld('electronAPI', {
  sendPathToMain: (pathToFile) => ipcRenderer.invoke('get-path', pathToFile)
})