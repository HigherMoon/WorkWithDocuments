const xlsx = require('../node_modules/xlsx');
const sqlite = require("../node_modules/sqlite3").verbose();
const fs = require('fs');

const { app, BrowserWindow, ipcMain } = require('electron/main');
const { table } = require('node:console');
const { type } = require('node:os');
const path = require('node:path'); 
// Путь к БД после создания проекта (создать папку saves и закинуть файл *.db)
// const dbPath = path.resolve(__dirname, '../../saves/personal.db')
// const dbPath = path.join(app.getAppPath(), "../saves/main.db");
//const dbPath = path.resolve(__dirname, "../../main.db");
const dbPath = path.resolve(__dirname, "../saves/main.db");

let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
   if (err) {
      errDB = err;
      return console.error(err.message);
   }
   else {
      console.log("<Database> База данных подключена");
}});   
let errDB;

function createWindow() { 
   const win = new BrowserWindow({
      width: 1200,
      height: 700,
      webPreferences: {
         preload: path.join(__dirname, '../preload.js')
      }
    })
   win.loadFile('html/index.html');

   //win.webContents.openDevTools();
}  

app.whenReady().then(() => {
    createWindow();
    checkDatabaseTables();
    db.run('PRAGMA foreign_keys = 1');
})

app.on('window-all-closed', () => {
   db.close(); 
   app.quit();
})

//////////////////////////////////////////////////
/////// Получение таблицы и инфы о бд SQL ////////
//////////////////////////////////////////////////
 ipcMain.handle('get-database-status', (event) => {
   let answer = {
      "err": errDB,
      "db_path": dbPath
   }
   return answer;
 });
 ipcMain.handle('get-table-DB', (event, tableName) => {
   return new Promise((resolve, reject) => {
      resolve(sqlSelectAllFromTable(tableName).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-UP', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurUpDB(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-PP', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurPersonalPlan(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-hours-person', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurHoursTeachers(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-stats-person', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurStatsTeachers(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-pp-database', (event) => {
   return new Promise((resolve, reject) => {
      resolve(getCurPPDB().then(i => { return i }));
   });
 });
 ipcMain.handle('get-actual-pp-up', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getActualDataPPUP(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-flows', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurFlows(data).then(i => { return i }));
   });
 });



 ipcMain.handle('update-table-kaf', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updatePersonal(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-flows', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updateFlows(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-groups', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updateGroups(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-up', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updateUP(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-pp', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updatePersonalPlan(data).then(i => { 
         return i;
       }));
   });
 });
 
ipcMain.handle('insert-table-kaf', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoKAF(data).then(i => { 
         return i;
       }));
   });
 });
ipcMain.handle('insert-table-flows', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoFlows(data).then(i => { 
         return i;
       }));
   });
 });
ipcMain.handle('insert-table-groups', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoGroups(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('insert-table-up', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoUP(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('insert-table-pp', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoPP(data).then(i => { 
         return i;
       }));
   });
 });


 ipcMain.handle('delete-table-kaf', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromKaf(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('delete-table-flows', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromFlows(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('delete-table-groups', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromGroups(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('delete-table-up', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromUP(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('delete-table-pp', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromPP(data).then(i => { 
         return i;
       }));
   });
 });
/////////////////////////////////////
/////// Добавление строк SQL ////////
/////////////////////////////////////
function sqlInsertIntoKAF(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO Кафедра (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о новом человеке внесены.");
      });
   });
}
function sqlInsertIntoFlows(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO Потоки (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о новом потоке внесены.");
      });
   });
}
function sqlInsertIntoGroups(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO Группы (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о новом потоке внесены.");
      });
   });
}
function sqlInsertIntoUP(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO Учебный_план (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о новом предмете в учебном плане внесены.");
      });
   });
}
function sqlInsertIntoPP(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO Персональный_план (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о новом предмете в учебном плане внесены.");
      });
   });
}

function sqlInsertIntoPLAN(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      //let numbersOfVopros = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO План (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о предмете внесены.");
      });
   });
}
function sqlInsertIntoPersonalPLAN(data) {
   return new Promise((resolve, reject) => {

      let sqlColumns = [];
      //let numbersOfVopros = [];
      let sqlData = [];
      for (let i in data) {
         if (data[i] != "") {
            if (isNaN(Number(data[i]))){
               sqlData.push("\'" + data[i] + "\'");
            }
            else {
              sqlData.push(data[i]);
            }
            sqlColumns.push(i);
         }
      }

      let sql = `INSERT INTO Персональный_план (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      db.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о персональном предмете внесены.");
      });
   });
};


//////////////////////////////////////////////
/////// Изменение значений таблиц SQL ////////
//////////////////////////////////////////////
function updatePersonal(data) {
   let updateStroka = [];
   for (let i in data) {
      if (i == "Personal_ID") { continue };
      if (data[i] != "") {
         if (isNaN(Number(data[i]))){
            updateStroka.push(i + " = \'" + data[i] + "\'");
         }
         else {
            updateStroka.push(i + " = " + data[i]);
         }
         
      }
      else {
         updateStroka.push(i + " = " + "null")
      }
   }
   return new Promise((resolve, reject) => {
      db.run(` Update Кафедра
               Set ${updateStroka.join(',')}
               Where Personal_ID = ${data.Personal_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data['ФИО']}' обновлены`)
      return 'Успешно';
   });
};
function updateFlows(data) {
   let updateStroka = [];
   for (let i in data) {
      if (data[i] != "") {
         if (isNaN(Number(data[i]))){
            updateStroka.push(i + " = \'" + data[i] + "\'");
         }
         else {
            updateStroka.push(i + " = " + data[i]);
         }
         
      }
      else {
         updateStroka.push(i + " = " + "null")
      }
   }
   return new Promise((resolve, reject) => {
      db.run(` Update Потоки
               Set ${updateStroka.join(',')}
               Where Flow_ID = ${data.Flow_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.Наименование}' обновлены`)
      return 'Успешно';
   });
};
function updateGroups(data) {
   let updateStroka = [];
   for (let i in data) {
      if (data[i] != "") {
         if (isNaN(Number(data[i]))){
            updateStroka.push(i + " = \'" + data[i] + "\'");
         }
         else {
            updateStroka.push(i + " = " + data[i]);
         }
         
      }
      else {
         updateStroka.push(i + " = " + "null")
      }
   }
   return new Promise((resolve, reject) => {
      db.run(` Update Группы
               Set ${updateStroka.join(',')}
               Where Group_ID = ${data.Group_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.Наименование}' обновлены`)
      return 'Успешно';
   });
};
function updateUP(data) {
   let updateStroka = [];
   for (let i in data) {
      if (data[i] != "") {
         if (isNaN(Number(data[i]))){
            updateStroka.push(i + " = \'" + data[i] + "\'");
         }
         else {
            updateStroka.push(i + " = " + data[i]);
         }
      }
      else {
         updateStroka.push(i + " = " + "null")
      }
   }
   return new Promise((resolve, reject) => {
      db.run(` Update Учебный_план
               Set ${updateStroka.join(',')}
               Where UP_ID = ${data.UP_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.UP_ID}' обновлены`)
      return 'Успешно';
   });
}
function updatePersonalPlan(data) {
   let updateStroka = [];
   for (let i in data) {
      if (data[i] != "") {
         if (isNaN(Number(data[i]))){
            updateStroka.push(i + " = \'" + data[i] + "\'");
         }
         else {
            updateStroka.push(i + " = " + data[i]);
         }
      }
      else {
         updateStroka.push(i + " = " + "null")
      }
   }
   return new Promise((resolve, reject) => {
      db.run(` Update Персональный_план
               Set Часы = ${data.Часы_преподавателя}
               Where UP_ID = ${data.UP_ID} and Personal_ID=${data.Personal_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.UP_ID}' обновлены`)
      return 'Успешно';
   });
}

//////////////////////////////////////////////
/////////// Удаление из таблиц SQL ///////////
//////////////////////////////////////////////

function deleteFromKaf(data) {
   return new Promise((resolve, reject) => {
      db.run(` DELETE FROM Кафедра
               Where Personal_ID = ${data.Personal_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные человека с ID: '${data.Personal_ID}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromFlows(data) {
   return new Promise((resolve, reject) => {
      db.run(` DELETE FROM Потоки
               Where Flow_ID = ${data.Flow_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные потока с ID: '${data.Flow_ID}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromGroups(data) {
   return new Promise((resolve, reject) => {
      db.run(` DELETE FROM Группы
               Where Group_ID = ${data.Group_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные группы с ID: '${data.Group_ID}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromUP(data) {
   return new Promise((resolve, reject) => {
      db.run(` DELETE FROM Учебный_план
               Where UP_ID = ${data.UP_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные предмета из учебного плана с ID: '${data.UP_ID}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromPP(data) {
   return new Promise((resolve, reject) => {
      db.run(` DELETE FROM Персональный_план
               Where UP_ID = ${data.UP_ID} and Personal_ID=${data.Personal_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные предмета из учебного плана с ID: '${data.UP_ID}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
////////////////////////////////////////
/////// Пересоздание таблиц SQL ////////
////////////////////////////////////////
function checkDatabaseTables() {
   db.serialize(function() {
      //console.log(dbpath);
      
      //sqlDropTable('Кафедра');
      //sqlDropTable('Группы');
      //sqlDropTable('Потоки');
      //sqlDropTable('Учебный_план');
      //sqlDropTable('Персональный_план');
   
      createDatabases();
      //fillDatabases();
      
   })
};

/////////////////////////////////////////////////////
/////// Заполнение таблиц рыбным текстом SQL ////////
/////////////////////////////////////////////////////
function fillDatabases() {
   return new Promise((resolve, reject) => {
      db.run(`Insert into Кафедра (ФИО, Часы, Телефон, Почта, Должность, Ставка)
                           Values ('Иванов И.И', 1200, '7-999-999-1234', 'NNN@mail.ru', 'Препод', 2.5),
                                 ('Афанасьев А.А', 900, '7-222-222-1234', 'AAA@mail.ru', 'Препод', 2),
                                 ('Ибрагимовиевич В.В.', 1200, '7-333-333-1234', 'NBB@mail.ru', 'Заведующий', 1.5)
      `, (err, rows) => { if (err) { return console.error(err.message) }} );

      db.run(`Insert into Потоки (Flow_ID, Факультет, Год, Форма_обучения, Наименование)
                              Values (1, 'МТ', '2023/2024', 'Очное', 'МТ301-302_2023/2024'),
                                     (2, 'ФТ', '2023/2024', 'Очное', 'ФТ-101_2023/2024'),
                                     (3, 'ИТ', '2023/2024', 'Заочное', 'ИТ-101_2023/2024')
      `, (err, rows) => { if (err) { return console.error(err.message) }} );

      db.run(`Insert into Группы (Flow_ID, Наименование, Студенты_Б, Студенты_ВБ)
                        Values   (1, 'МТ-301', 15, 30),
                                 (1, 'МТ-302', 30, 3),
                                 (2, 'ФТ-101', 8, 35),
                                 (3, 'ИТ-401', 10, 15)
      `, (err, rows) => { if (err) { return console.error(err.message) }} );

      db.run(`Insert into Учебный_план (Flow_ID, Наименование, Семестр, Тип, Количество_подгрупп, Часы_УП, Часы)
                              Values (1, 'База данных', 1, 'Лекции', 1, 30, 30),
                                     (1, 'База данных', 1, 'Практики', 3, 30, 90),
                                     (2, 'База данных', 1, 'Практики', 4, 45, 180),
                                     (3, 'История', 1, 'Лекции', 1, 45, 45)
      `, (err, rows) => { if (err) { return console.error(err.message) }} );

      db.run(`Insert into Персональный_план (UP_ID, Personal_ID, Часы)
                              Values (1, 1, 20),
                                     (1, 2, 20)
      `, (err, rows) => { if (err) { return console.error(err.message) }} );

      console.log(`(++) Таблицы заполнены примерными данными.`)
   });
};

/////////////////////////////////////////////////////
/////// Получение всех данных из таблицы SQL ////////
/////////////////////////////////////////////////////
function sqlSelectAllFromTable(tableName) {
   return new Promise((resolve, reject) => {
      sql = `Select * From ${tableName}`;
      db.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         }
         resolve(rows);
      });
   });
};

///////////////////////////////////////////////
/////// Удаление и создание таблиц SQL ////////
///////////////////////////////////////////////
function sqlDropTable(tableName) {
   return new Promise((resolve, reject) => {
      db.run(`DROP TABLE ${tableName}`, (err, rows) => {
         if (err) {
            return console.error(err.message);
         }
         return console.log(`(-) Таблица '${tableName}' удалена.`);
      });
   });
    
};  
function createDatabases() {
   return new Promise((resolve, reject) => {
      db.run(`Create table if not exists Кафедра (
         Personal_ID     INTEGER, 
         ФИО             TEXT NOT NULL,
         Часы            REAL NOT NULL,
         Должность       TEXT,
         Звание          TEXT,
         Учёная_степень  TEXT,
         Телефон         TEXT,
         Почта           TEXT, 
         ГПД             REAL,
         Ставка          REAL,
            PRIMARY KEY (Personal_ID),
            UNIQUE (ФИО, Телефон, Почта) 
         )`);

      db.run(`Create table if not exists Потоки (
         Flow_ID           INTEGER NOT NULL,
         Наименование      TEXT NOT NULL,
         Факультет         TEXT NOT NULL,
         Год               TEXT NOT NULL,
         Форма_обучения    TEXT NOT NULL,

            Primary key (Flow_ID)
         )`);

      db.run(`Create table if not exists Группы (
         Group_ID            INTEGER,
         Flow_ID             INTEGER NOT NULL,
         Наименование        TEXT NOT NULL,
         Студенты_Б          INTEGER,
         Студенты_ВБ         INTEGER,
            PRIMARY KEY (Group_ID),
            FOREIGN KEY (Flow_ID) REFERENCES Потоки (Flow_ID) ON DELETE CASCADE,
            UNIQUE (Наименование) 
         )`);
      /*
      db.run(`Create table if not exists Дисциплины (
         Discipline_ID   INTEGER,
         Наименование    TEXT NOT NULL,
            PRIMARY KEY (Discipline_ID),
            UNIQUE (Наименование) 
         )`);
      */
      db.run(`Create table if not exists Учебный_план (
         UP_ID                INTEGER,
         Flow_ID              INTEGER NOT NULL,
         Наименование         TEXT NOT NULL,
         Семестр              INTEGER NOT NULL,
         Тип                  TEXT NOT NULL,
         Количество_подгрупп  INTEGER NOT NULL,
         Часы_УП              INTEGER,
         Часы                 INTEGER NOT NULL,
            PRIMARY KEY (UP_ID),
            UNIQUE (Flow_ID, Наименование, Семестр, Тип),
            FOREIGN KEY (Flow_ID) REFERENCES Потоки (Flow_ID) ON DELETE CASCADE
         )`);

      db.run(`Create table if not exists Персональный_план (
         Personal_ID     INTEGER,
         UP_ID           INTEGER,
         Часы            INTEGER NOT NULL,
            PRIMARY KEY (Personal_ID, UP_ID),
            FOREIGN KEY (UP_ID) REFERENCES Учебный_план (UP_ID) ON DELETE CASCADE,
            FOREIGN KEY (Personal_ID) REFERENCES Кафедра (Personal_ID) ON DELETE CASCADE
         )`);
      console.log(`(+) Таблицы созданы.`)
    });
};



function getCurFlows(data) {
   return new Promise((resolve, reject) => {
      sql = `Select Flow_ID, Наименование, Год, Форма_обучения
            From Потоки`;
            db.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         resolve(rows);
      });
   });
}
function getCurPPDB() {
   return new Promise((resolve, reject) => {
      sql = `Select Кафедра.Personal_ID, ФИО, Должность, 
                    Кафедра.Часы as 'Нагрузка', 0+sum(Персональный_план.Часы) as 'Часы'
            From Кафедра LEFT JOIN Персональный_план on Кафедра.Personal_ID=Персональный_план.Personal_ID
            Group by Кафедра.Personal_ID, ФИО, Должность, Кафедра.Часы`;
            db.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         resolve(rows);
      });
   });
}

function getActualDataPPUP(data) {
   return new Promise((resolve, reject) => {
      sql = `Select UP_ID, Потоки.Наименование as 'Поток', Учебный_план.Наименование, Тип, Часы_УП, Часы
             From Учебный_план join Потоки on Учебный_план.Flow_ID=Потоки.Flow_ID
             Where Год='${data.Год}' and Семестр=${data.Семестр} and Форма_обучения='${data.Форма_обучения}'`;
            db.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         resolve(rows);
      });
   });
}


function getCurUpDB(data) {
   return new Promise((resolve, reject) => {
      sql = `Select UP_ID, Учебный_план.Flow_ID, Факультет, Учебный_план.Наименование as Дисциплина, 
                     Потоки.Наименование as Академическая_группа,
                     Год, Семестр, Форма_обучения, Тип, Количество_подгрупп, Часы_УП, Часы 
            From Учебный_план JOIN Потоки on Потоки.Flow_ID=Учебный_план.Flow_ID
            Where Год='${data.Год}' and Семестр='${data.Семестр}' and Форма_обучения='${data.Форма_обучения}'`;
            db.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         
         resolve(rows);
      });
   });
}

function getCurPersonalPlan(data) {
   console.log(data)
   return new Promise((resolve, reject) => {
      sql = `Select Персональный_план.UP_ID, Потоки.Наименование as 'Поток', Учебный_план.Наименование as 'Дисциплина', 
                    Учебный_план.Тип as 'Тип', Учебный_план.Часы as 'Общие_часы', 
                    Учебный_план.Часы_УП, Персональный_план.Часы as 'Часы_преподавателя'
             From (Персональный_план join Учебный_план on Персональный_план.UP_ID=Учебный_план.UP_ID)
                   join Потоки on Учебный_план.Flow_ID=Потоки.Flow_ID
             Where Персональный_план.Personal_ID=${data.Personal_ID} and
                   Семестр = ${data.Семестр} and
                   Год = '${data.Год}' and
                   Форма_обучения = '${data.Форма_обучения}'
                   `;
            db.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         resolve(rows);
      });
   });
}

function getCurHoursTeachers(data) {
   return new Promise((resolve, reject) => {
      sql = `Select 0 + sum(Часы) as 'Часы'
            From Персональный_план
            Where Personal_ID=${data.Personal_ID}
            Group by Personal_ID`;
      db.all(sql, [], (err, rows) => {
      if (err) {
         console.error(err.message);
      };
      
      resolve(rows);
      });
   });
}

function getCurStatsTeachers(data) {
   console.log(data)
   return new Promise((resolve, reject) => {
      sql = `Select Personal_ID, ФИО, sum(Персональный_план.Часы)
             From ((Персональный_план join Учебный_план on Персональный_план.UP_ID=Учебный_план.UP_ID)
                   join Потоки on Учебный_план.Flow_ID=Потоки.Flow_ID)
                   join Кафедра on Персональный_план.Personal_ID=Кафедра.Personal_ID
             Where Семестр = ${data.Семестр} and
                   Год = '${data.Год}' and
                   Форма_обучения = '${data.Форма_обучения}'
             Group by Personal_ID, ФИО
                   `;
            db.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         console.log(rows)
         resolve(rows);
      });
   });
}