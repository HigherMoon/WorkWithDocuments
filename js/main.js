console.log('Launch: Succesful');

const {app, BrowserWindow} = require('electron'); 
const url = require('url');
const path = require('path');
let win;  

// Создание окна на рабочем столе
// Окно загружает ссылку на index.html файл 
function createWindow() { 
   win = new BrowserWindow({width: 1000, height: 700 }) 
   win.loadURL(url.format ({ 
      pathname: path.join(__dirname, '../html/index.html'), 
      protocol: 'file:', 
      slashes: true 
   })
   ) 
   win.maximize();
   // При закрытии окна изменяется его значение на null 
   win.on('closed', () => {
        win = null;
   })
}  

// Создание окна при инициализации приложения
app.on('ready', createWindow) 

// Если все окна закрыты, то полностью заканчивает работу приложения
app.on('window-all-closed', () => {
        app.quit()
})

