const xlsx = require('../node_modules/xlsx');
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path'); 

function createWindow() { 
   const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: true,
         preload: path.join(__dirname, '../preload.js')
      }
    })
   win.loadFile('html/index.html');
   win.maximize(); 
   win.webContents.openDevTools();
}  

app.whenReady().then(() => {
    createWindow()
 })

app.on('window-all-closed', () => {
    app.quit()
})

/*
* ipcMain - канал из main.js | handle() - принимает запрос и возвращает ответ
* 'get-path' - функция для вызова в main.js и принятии в preload.js
* (event, pathToFile) - аргумент
*/
ipcMain.handle('get-path', (event, pathToFile) => {
   return parseXSLFile(pathToFile);
 })

/*
* xlsx.readFile(...) - считывание xlsx таблицы по пути
* file.SheetNames - названия таблиц в файле exsel
* temp - преобразует таблицу из листа exsel в JSON формат
* data.push(res) - запихивает все данные в data
* data - преобразованная таблица Exsel в JSON
*/
function parseXSLFile(pathToFile) {
   const file = xlsx.readFile(pathToFile);
   let data = []
   const sheets = file.SheetNames;
   for (let i = 0; i < sheets.length; i++) {
      const temp = xlsx.utils.sheet_to_json(
         file.Sheets[file.SheetNames[i]]
      )
      console.log(temp);
      temp.forEach((res) => {
         data.push(res);
      })
   }
   return data;
}