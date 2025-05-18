const sqlite = require("../node_modules/sqlite3").verbose();

const { app, BrowserWindow, ipcMain } = require('electron/main');
const { table, error } = require('node:console');
const { type } = require('node:os');
const path = require('node:path'); 

// - для удобства разработки > const dbPath = path.resolve(__dirname, "../saves/main.db");
// - для итогового вариант приложени > const dbPath = path.resolve(__dirname, "../../main.db");
const dbPath = path.resolve(__dirname, "../saves/main.db");

// Создание базы данных, попытка открыть существующий, иначе создать новую
let database = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (error) => {
   checkAndCreateDatabase();
   if (error) {
      errorDatabase = error;
      return console.error(error.message);
   }
   else {
      console.log("<Database> База данных подключена");
      console.log(dbPath)
}});   
let errorDatabase;

// Создание первоначсального окна приложения
function createWindow() {
   const win = new BrowserWindow({
      autoHideMenuBar: true,
      width: 1200,
      height: 700,
      webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
         nodeIntegration: true,
      }
    })
   win.loadFile('html/index.html'); // Открытие первой страницы
   win.maximize(); // Раскрытие приложения на весь экран
   win.webContents.openDevTools(); // Открытие инструмента разработчика из браузера
}  

// Начальный скрипт, запускающийся автоматически при запуске приложения
app.whenReady().then(() => {
    createWindow();
})

// Событие закрытия всех окон приложения
app.on('window-all-closed', () => {
   database.close(); 
   app.quit();
})

// Текущий статус базы данных
ipcMain.handle('get-database-status', (event) => {
   if (errorDatabase == undefined) errorDatabase = "Подключено"
   let answer = {
      "err": errorDatabase,
      "db_path": dbPath
   }
   return answer;
 });

 ipcMain.handle('get-table-database', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlSelectAllFromTable(data).then(i => { return i }));
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
 ipcMain.handle('get-cur-teachers', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurTeachers(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-list-teachers', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurListTeachers(data).then(i => { return i }));
   });
 });

 ipcMain.handle('get-cur-pp-database', (event) => {
   return new Promise((resolve, reject) => {
      resolve(getCurPPDB().then(i => { return i }));
   });
 });
 ipcMain.handle('get-actual-pp-up', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getActualDataPPUP(data).then(i => { return i; }));
   });
 });
 ipcMain.handle('get-cur-flows', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurFlows(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-groups', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurGroups(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-disciplines', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurDisciplines(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-types', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurTypes(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-cur-syllabus', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getCurSyllabus(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-actual-flows-for-personal-hours', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getActualFlowsForPersonalHours(data).then(i => { return i }));
   });
 });
 ipcMain.handle('get-actual-syllabus-for-personal-hours', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(getActualSyllabusForPeronalHours(data).then(i => { return i }));
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
 ipcMain.handle('update-table-types', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updateTypes(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-disciplines', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updateDisciplines(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-syllabus', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updateSyllabus(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('update-table-personal-plan', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(updatePersonalPlanHours(data).then(i => { 
         return i;
       }));
   });
 });
 
ipcMain.handle('insert-table-kafedra', (event, data) => {
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
 ipcMain.handle('insert-table-disciplines', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoDiscipline(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('insert-table-types', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(sqlInsertIntoTypes(data).then(i => { 
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
 ipcMain.handle('delete-table-types', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromTypes(data).then(i => { 
         return i;
       }));
   });
 });
 ipcMain.handle('delete-table-disciplines', (event, data) => {
   return new Promise((resolve, reject) => {
      resolve(deleteFromDisciplines(data).then(i => { 
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

      let sql = `INSERT INTO kafedra (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      database.run(sql, (err) => {
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

      let sql = `INSERT INTO flows (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      database.run(sql, (err) => {
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

      let sql = `INSERT INTO groups (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      database.run(sql, (err) => {
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

      let sql = `INSERT INTO syllabus (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      database.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о новом предмете в учебном плане внесены.");
      });
   });
}


function sqlInsertIntoDiscipline(data) {
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

      let sql = `INSERT INTO disciplines (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      database.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о учебной дисциплине внесены.");
      });
   });
}


function sqlInsertIntoTypes(data) {
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

      let sql = `INSERT INTO types (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      database.run(sql, (err) => {
         if (err) {
            console.error(err.message);
            resolve(err.message);
         } 
         resolve("Данные о типе внесены.");
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

      let sql = `INSERT INTO personal_plan (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      console.log(sql)
      database.run(sql, (err) => {
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
   
      database.run(sql, (err) => {
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

      let sql = `INSERT INTO personal_plan (${sqlColumns.join()}) 
         Values (${sqlData.join()})`;   
   
      database.run(sql, (err) => {
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
         else { updateStroka.push(i + " = " + data[i]); }
      }
      else { updateStroka.push(i + " = " + "null") }
   }
   return new Promise((resolve, reject) => {
      database.run(` UPDATE kafedra
               SET ${updateStroka.join(',')}
               WHERE id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data['Фамилия']}' обновлены`)
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
         }}
      else {
         updateStroka.push(i + " = " + "null")
      }}
   return new Promise((resolve, reject) => {
      database.run(` UPDATE flows
               SET ${updateStroka.join(',')}
               WHERE id = ${data.Flow_ID}`, 
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
      database.run(`UPDATE groups
               SET ${updateStroka.join(',')}
               WHERE id = ${data.Group_ID}`, 
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
      database.run(` UPDATE syllabus
               SET ${updateStroka.join(',')}
               WHERE id = ${data.UP_ID}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.id}' обновлены`)
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
      database.run(`UPDATE personal_plan
               SET hours = ${data.Часы_преподавателя}
               WHERE s_id = ${data.s_id} and p_id=${data.p_id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.s_id}' обновлены`)
      return 'Успешно';
   });
}
function updateTypes(data) {
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
      database.run(`UPDATE types
               SET name = '${data.name}'
               WHERE id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.name}' обновлены`)
      return 'Успешно';
   });
}
function updateDisciplines(data) {
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
      database.run(`UPDATE disciplines
               SET name = '${data.name}'
               WHERE id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.name}' обновлены`)
      return 'Успешно';
   });
}
function updateSyllabus(data) {
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
      database.run(`UPDATE syllabus
               SET subgroups = '${data.subgroups}',
                   sub_hours = '${data.sub_hours}',
                   hours = '${data.hours}'
               WHERE id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.name}' обновлены`)
      return 'Успешно';
   });
}
function updatePersonalPlanHours(data) {
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
      database.run(`UPDATE syllabus
               SET subgroups = '${data.subgroups}',
                   hours = '${data.hours}'
               WHERE p_id = ${data.p_id}
                  AND s_id = ${data.s_id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
               });
      console.log(`Данные для '${data.name}' обновлены`)
      return 'Успешно';
   });
}



//////////////////////////////////////////////
/////////// Удаление из таблиц SQL ///////////
//////////////////////////////////////////////

function deleteFromKaf(data) {
   return new Promise((resolve, reject) => {
      database.run(` DELETE FROM kafedra
               Where id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные человека с ID: '${data.id}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromFlows(data) {
   return new Promise((resolve, reject) => {
      database.run(` DELETE FROM flows
               Where id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные потока с ID: '${data.id}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromGroups(data) {
   return new Promise((resolve, reject) => {
      database.run(` DELETE FROM groups
               Where id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные группы с ID: '${data.id}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromUP(data) {
   return new Promise((resolve, reject) => {
      database.run(` DELETE FROM syllabus
               Where id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные предмета из учебного плана с ID: '${data.id}' удалены`);
                     return 'Успешно';
                  }
               });
   });
}
function deleteFromPP(data) {
   return new Promise((resolve, reject) => {
      database.run(
         ` DELETE FROM personal_plan
         Where s_id = ${data.s_id} and p_id=${data.p_id}`, 
         (err, rows) => { 
            if (err) { 
               return console.error(err.message) 
            }
            else {
               console.log(`Данные предмета из учебного плана с ID: '${data.s_id}' удалены`);
               return 'Успешно';
            }
         });
   });
}
function deleteFromTypes(data) {
   return new Promise((resolve, reject) => {
      database.run(` DELETE FROM types
               Where id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные предмета из учебного плана с ID: '${data.id}' удалены`);
                     return 'Успешно';
                  }
               });
   })}
function deleteFromDisciplines(data) {
   return new Promise((resolve, reject) => {
      database.run(` DELETE FROM disciplines
               Where id = ${data.id}`, 
               (err, rows) => { 
                  if (err) { 
                     return console.error(err.message) 
                  }
                  else {
                     console.log(`Данные предмета из учебного плана с ID: '${data.id}' удалены`);
                     return 'Успешно';
                  }
               });
   })}

/////////////////////////////////////////////////////
/////// Заполнение таблиц рыбным текстом SQL ////////
/////////////////////////////////////////////////////
function fillDatabases() {
   return new Promise((resolve, reject) => {
      database.serialize(function() {
         database.run(`
            Insert into kafedra (
               firstname,
               secondname,
               hours, 
               phone, 
               mail, 
               position, 
               salary)
            Values ('Иванов', 'Иван', 1200, '7-999-999-1234', 'NNN@mail.ru', 'Препод', 2.5),
                  ('Афанасьев', 'Антон', 900, '7-222-222-1234', 'AAA@mail.ru', 'Препод', 2),
                  ('Ибрагимовиевич', 'Олег', 1200, '7-333-333-1234', 'NBB@mail.ru', 'Заведующий', 1.5)
         `, (err, rows) => { if (err) { return console.error(err.message) }} );
         database.run(`
            Insert into flows (
               faculty, 
               year, 
               education_form, 
               name)
            Values ('МТ', '2023/2024', 'Очное', 'МТ301-302'),
                  ('ФТ', '2023/2024', 'Очное', 'ФТ-101'),
                  ('ИТ', '2023/2024', 'Заочное', 'ИТ-101')
         `, (err, rows) => { if (err) { return console.error(err.message) }} );
         database.run(`
            Insert into groups (
               flow_id, 
               name, 
               students_b, 
               students_nb)
            Values (1, 'МТ-301', 15, 30),
                  (1, 'МТ-302', 30, 3),
                  (2, 'ФТ-101', 8, 35),
                  (3, 'ИТ-401', 10, 15)
         `, (err, rows) => { if (err) { return console.error(err.message) }} );
         database.run(`
            Insert into disciplines (name)
            Values ('База данных'), ('История')
         `, (err, rows) => { if (err) { return console.error(err.message) }} );
         database.run(`
            Insert into syllabus (
               flow_id, 
               discipline_id, 
               semester, 
               type, 
               subgroups, 
               sub_hours, 
               hours)
            Values (1, 1, 1, 'Лекции', 1, 30, 30),
                  (1, 1, 1, 'Практики', 3, 30, 90),
                  (2, 1, 1, 'Практики', 4, 45, 180),
                  (3, 2, 1, 'Лекции', 1, 45, 45)
         `, (err, rows) => { if (err) { return console.error(err.message) }} );
         database.run(`
            Insert into personal_plan (
               s_id,
               p_id,
               subgroups,
               hours)
            Values (1, 1, 1, 20),
                     (1, 2, 1, 20)
         `, (err, rows) => { if (err) { return console.error(err.message) }} );
      });
      console.log(`(++) Таблицы заполнены примерными данными.`)
   });
};

/////////////////////////////////////////////////////
/////// Получение всех данных из таблицы SQL ////////
/////////////////////////////////////////////////////
function sqlSelectAllFromTable(tableName) {
   return new Promise((resolve, reject) => {
      sql = `Select * From ${tableName}`;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         }
         resolve(rows);
      });
   });
};

// Удаление таблицы по названию
function sqlDropTable(tableName) {
   return new Promise((resolve, reject) => {
      database.run(`DROP TABLE ${tableName}`, (err, rows) => {
         if (err) {
            return console.error(`(-) ${err.message}`);
         }
         return console.log(`(-) Таблица '${tableName}' удалена.`);
      })
   })
};

function getCurFlows(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         id
         , name
         , year
         , education_form
      FROM flows
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   });
}

function getCurGroups(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         groups.id
         , groups.flow_id
         , groups.name as name
         , groups.students_b
         , groups.students_nb
         , flows.name as flow
      FROM groups
      JOIN flows
         ON flows.id = groups.flow_id
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   });
}

function getCurDisciplines(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         id
         , name
      FROM disciplines
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   });
}

function getCurTypes(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         id
         , name
      FROM types
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   });
}
function getCurSyllabus(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         syllabus.id
         , flows.name AS flow
         , disciplines.name AS discipline
         , types.name AS type
         , syllabus.subgroups
         , syllabus.sub_hours
         , syllabus.hours
         , syllabus.semester
      FROM syllabus
      JOIN types ON types.id = syllabus.type
      JOIN disciplines ON disciplines.id = syllabus.discipline_id
      JOIN flows ON flows.id = syllabus.flow_id
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   })
}
///
function getActualFlowsForPersonalHours(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT
         id, name
      FROM flows
      WHERE education_form = '${data.education_form}'
         AND year = '${data.year}'
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   })
}
function getActualSyllabusForPeronalHours(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT
         syllabus.id AS syllabus_id
         , syllabus.discipline_id
         , disciplines.name AS discipline
         , flows.id AS flows_id
         , flows.name AS flows_name
         , syllabus.sub_hours
         , syllabus.subgroups
         , syllabus.hours
         , types.name AS type_name
         , types.id AS type_id
         , 0 + (SELECT sum(pp.hours)
            FROM personal_plan pp
            JOIN syllabus s
               ON pp.s_id = s.id
            WHERE syllabus.id = pp.s_id 
         ) AS used_hours
      FROM syllabus
      JOIN flows
         ON flows.id = syllabus.flow_id
      JOIN disciplines
         ON disciplines.id = syllabus.discipline_id
      JOIN types
         ON types.id = syllabus.type
      WHERE flows.year = '${data.year}'
         AND flows.education_form = '${data.education_form}'
         AND syllabus.id NOT IN (SELECT s_id
                                 FROM personal_plan
                                 WHERE p_id = ${data.p_id})
      `;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
      resolve(rows);
      });
   })
}
////
function getCurPPDB() {
   return new Promise((resolve, reject) => {
      sql = `
      Select 
         kafedra.id as 'id',
         kafedra.firstname as 'Фамилия', 
         kafedra.secondname as 'Имя', 
         kafedra.position as 'Должность',
         kafedra.hours as 'Нагрузка', 
         0 + sum(personal_plan.hours) as 'Часы'
      FROM kafedra LEFT JOIN personal_plan on kafedra.id=personal_plan.p_id
      GROUP BY kafedra.id, kafedra.firstName, kafedra.position, kafedra.hours`;
      database.all(sql, [], (err, rows) => {
         if (err) {
            console.error(err.message);
         };
         resolve(rows);
      });
   });
}

function getActualDataPPUP(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         syllabus.id, 
         flows.name AS flow, 
         disciplines.name, 
         flows.education_form, 
         syllabus.sub_hours, 
         syllabus.hours,
         types.name AS typeName,
         0 + (SELECT sum(pp.hours)
          FROM personal_plan pp
          JOIN syllabus s
            ON pp.s_id = s.id
          WHERE syllabus.id = pp.s_id) AS usedHours
      FROM syllabus
      JOIN flows 
         ON syllabus.flow_id=flows.id
      JOIN disciplines 
         ON disciplines.id = syllabus.discipline_id
      JOIN types
         ON types.id = syllabus.type
      WHERE year='${data.Год}' 
         AND semester=${data.Семестр} 
         AND education_form='${data.Форма_обучения}'
         AND syllabus.id NOT IN (
            SELECT s_id
            FROM personal_plan
            WHERE p_id = ${data.id}
         )
         `;
            database.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         resolve(rows);
      });
   });
}


function getCurUpDB(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         syllabus.id, 
         syllabus.flow_id, 
         flows.faculty, 
         disciplines.name as 'Дисциплина',  
         flows.name as 'Академическая_группа',   
         flows.year,
         syllabus.semester,
         flows.education_form,
         syllabus.semester,
         syllabus.subgroups,
         syllabus.sub_hours,
         syllabus.hours
      FROM syllabus JOIN flows 
         ON flows.id=syllabus.flow_id
      JOIN disciplines 
         ON disciplines.id = syllabus.discipline_id
      WHERE flows.year='${data.Год}' 
         AND syllabus.semester='${data.Семестр}' 
         AND flows.education_form='${data.Форма_обучения}'`;
            database.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         
         resolve(rows);
      });
   });
}

function getCurPersonalPlan(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 
         personal_plan.p_id AS pId
         , flows.id AS flowId
         , flows.name AS flowName
         , disciplines.id AS disciplineId
         , disciplines.name AS disciplineName
         , types.id AS typeId
         , types.name AS typeName
         , syllabus.semester AS semester
         , syllabus.hours AS hours
         , syllabus.sub_hours AS subHours
         , syllabus.id as s_id
         , personal_plan.hours AS personalHours
         , 0 + (SELECT SUM(pp.hours) 
            FROM syllabus s
            JOIN personal_plan pp ON s.id = pp.s_id
            WHERE s.id = syllabus.id) AS totalHours
      FROM personal_plan
      JOIN syllabus
         ON personal_plan.s_id=syllabus.id
      JOIN flows
         ON syllabus.flow_id=flows.id
      JOIN disciplines 
         ON disciplines.id = syllabus.discipline_id
      JOIN types
         ON syllabus.type = types.id
      WHERE personal_plan.p_id=${data.Personal_ID}
         AND syllabus.semester = ${data.Семестр}
         AND flows.year = '${data.Год}'
         AND flows.education_form = '${data.Форма_обучения}'
      `;
            database.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         resolve(rows);
      });
   });
}

function getCurHoursTeachers(data) {
   return new Promise((resolve, reject) => {
      sql = `
      SELECT 0 + sum(hours) as 'Часы'
      FROM personal_plan
      WHERE p_id=${data.Personal_ID}
      GROUP BY p_id`;
      database.all(sql, [], (err, rows) => {
      if (err) {
         console.error(err.message);
      };
      resolve(rows);
   });});
}

function getCurStatsTeachers(data) {
   console.log(data)
   return new Promise((resolve, reject) => {
      sql = `
      Select 
         syllabus.p_id, 
         kafedra.secondname, 
         sum(personal_plan.hours)
      From ((personal_plan join syllabus 
         ON personal_plan.s_id=syllabus.id)
      JOIN flows
         ON syllabus.flow_id=flows.id)
      JOIN kafedra
         ON personal_plan.p_id=kafedra.id
      Where syllabus.semester = ${data.Семестр} and
            flows.year = '${data.Год}' and
            flows.education_form = '${data.Форма_обучения}'
      Group by syllabus.p_id, kafedra.firstname
                   `;
            database.all(sql, [], (err, rows) => {
            if (err) {
               console.error(err.message);
            };
         console.log(rows)
         resolve(rows);
})})}

function getCurTeachers(data) {
   console.log(data)
   return new Promise((resolve, reject) => {
      sql = `
      Select 
         id
         , firstname
         , secondname
         , surname
         , salary
      From kafedra
      `;
      database.all(sql, [], (err, rows) => {
      if (err) {
         console.error(err.message);
      };
      console.log(rows)
      resolve(rows);
})})};

function getCurListTeachers(data) {
   return new Promise((resolve, reject) => {
      sql = `
         SELECT
            flows.name AS flowName
            , disciplines.name AS disciplineName
            , types.name AS typeName
            , personal_plan.subgroups 
            , flows.year
            , flows.education_form 
            , syllabus.semester AS semester
            , syllabus.hours AS hours
            , syllabus.sub_hours AS subHours
            , personal_plan.hours AS personalHours
         FROM personal_plan
         JOIN syllabus
            ON personal_plan.s_id=syllabus.id
         JOIN flows
            ON syllabus.flow_id=flows.id
         JOIN disciplines 
            ON disciplines.id = syllabus.discipline_id
         JOIN types
            ON syllabus.type = types.id
         WHERE personal_plan.p_id = ${data.currentTeacher}
            AND flows.year = '${data.currentYear}'
            AND flows.education_form = '${data.currentFormOfEducation}'
      `;
      database.all(sql, [], (err, rows) => {
      if (err) {
         console.error(err.message);
      };
      console.log(rows)
      resolve(rows);
   })})
};

function checkAndCreateDatabase() {
   console.log('yes');
      database.run(`
   CREATE TABLE IF NOT EXISTS kafedra (
      id              INTEGER, 
      firstname       TEXT NOT NULL,
      secondname      REAL NOT NULL,
      surname         TEXT,
      position        TEXT,
      rank            TEXT,
      academic        TEXT,
      mail            TEXT, 
      phone           REAL,
      gpd             REAL,
      salary          REAL,
      hours           REAL,
   PRIMARY KEY (id),
   UNIQUE (firstname, secondname, surname))
      `);

      database.run(`
   CREATE TABLE IF NOT EXISTS flows (
      id               INTEGER NOT NULL,
      name             TEXT NOT NULL,
      faculty          TEXT NOT NULL,
      year             TEXT NOT NULL,
      education_form   TEXT NOT NULL,
   PRIMARY KEY (id))
      `);

      database.run(`      
   CREATE TABLE IF NOT EXISTS groups (
      id             INTEGER,
      flow_id        INTEGER NOT NULL,
      name           TEXT NOT NULL,
      students_b     INTEGER,
      students_nb    INTEGER,
   PRIMARY KEY (id),
   FOREIGN KEY (flow_id) REFERENCES flows (id) ON DELETE CASCADE,
   UNIQUE (name))
   `);

      database.run(`
   CREATE TABLE IF NOT EXISTS disciplines (
      id       INTEGER,
      name     TEXT NOT NULL,
   PRIMARY KEY (id),
   UNIQUE (name))
   `);

      database.run(`
   CREATE TABLE IF NOT EXISTS types (
      id      INTEGER,
      name   TEXT NOT NULL,
   PRIMARY KEY (id),
   UNIQUE (name))
      `);

      database.run(`
   CREATE TABLE IF NOT EXISTS syllabus (
      id                INTEGER,
      flow_id           INTEGER NOT NULL,
      discipline_id     INTEGER NOT NULL,
      semester          INTEGER,
      type              INTEGER,
      subgroups         INTEGER,
      sub_hours         INTEGER,
      hours             INTEGER,
   PRIMARY KEY (id),
   UNIQUE (flow_id, discipline_id, semester, type),
   FOREIGN KEY (type) REFERENCES types (id) ON DELETE CASCADE,
   FOREIGN KEY (flow_id) REFERENCES flows (id) ON DELETE CASCADE,
   FOREIGN KEY (discipline_id) REFERENCES disciplines (id) ON DELETE CASCADE)
   `);

      database.run(`
   CREATE TABLE IF NOT EXISTS personal_plan (
      p_id        INTEGER,
      s_id        INTEGER,
      subgroups   INTEGER NOT NULL,
      hours       INTEGER NOT NULL,
   PRIMARY KEY (p_id, s_id),
   FOREIGN KEY (s_id) REFERENCES syllabus (id) ON DELETE CASCADE,
   FOREIGN KEY (p_id) REFERENCES kafedra (id) ON DELETE CASCADE)
      `);
      console.log(`(+) Таблицы созданы.`)
}