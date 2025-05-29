const sqlite = require("../node_modules/sqlite3").verbose();
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

// Конфигурация базы данных
const dbPath = path.resolve(__dirname, "../saves/main.db");
let database;
let errorDatabase;

// Инициализация базы данных
function initializeDatabase() {
  database = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (error) => {
    checkAndCreateDatabase();
    if (error) {
      errorDatabase = error;
      console.error(error.message);
    } else {
      console.log("<Database> База данных подключена");
      console.log(dbPath);
    }
  });
}

// Создание главного окна приложения
function createWindow() {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });
  
  win.loadFile('html/index.html');
  win.maximize();
  win.webContents.openDevTools();
}

// Инициализация приложения
app.whenReady().then(() => {
  initializeDatabase();
  createWindow();
});

// Обработка закрытия приложения
app.on('window-all-closed', () => {
  database.close();
  app.quit();
});

// Вспомогательные функции для работы с базой данных
function prepareDataForQuery(data) {
  const columns = [];
  const values = [];
  
  for (const key in data) {
    if (data[key] !== "") {
      columns.push(key);
      values.push(isNaN(Number(data[key])) ? `'${data[key]}'` : data[key]);
    }
  }
  
  return { columns, values };
}

function prepareUpdateData(data, idField = 'id') {
  const updates = [];
  const id = data[idField];
  
  for (const key in data) {
    if (key === idField) continue;
    if (data[key] !== "") {
      updates.push(`${key} = ${isNaN(Number(data[key])) ? `'${data[key]}'` : data[key]}`);
    } else {
      updates.push(`${key} = NULL`);
    }
  }
  
  return { updates, id };
}

// Обработчики IPC для получения данных
ipcMain.handle('get-database-status', () => {
  return {
    err: errorDatabase || "Подключено",
    db_path: dbPath
  };
});

const createDataHandler = (queryFunction) => {
  return (event, data) => {
    return new Promise((resolve) => {
      resolve(queryFunction(data).then(result => result));
    });
  };
};

// Регистрация обработчиков IPC
const handlers = {
  // Получение данных
  'get-table-database': sqlSelectAllFromTable,
  'get-cur-UP': getCurUpDB,
  'get-cur-PP': getCurPersonalPlan,
  'get-cur-hours-person': getCurHoursTeachers,
  'get-cur-stats-person': getCurStatsTeachers,
  'get-cur-teachers': getCurTeachers,
  'get-cur-list-teachers': getCurListTeachers,
  'get-cur-pp-database': getCurPPDB,
  'get-actual-pp-up': getActualDataPPUP,
  'get-cur-flows': getCurFlows,
  'get-cur-groups': getCurGroups,
  'get-cur-disciplines': getCurDisciplines,
  'get-cur-types': getCurTypes,
  'get-cur-syllabus': getCurSyllabus,
  'get-actual-flows-for-personal-hours': getActualFlowsForPersonalHours,
  'get-actual-syllabus-for-personal-hours': getActualSyllabusForPeronalHours,
  
  // Обновление данных
  'update-table-kaf': updatePersonal,
  'update-table-flows': updateFlows,
  'update-table-groups': updateGroups,
  'update-table-up': updateUP,
  'update-table-pp': updatePersonalPlan,
  'update-table-types': updateTypes,
  'update-table-disciplines': updateDisciplines,
  'update-table-syllabus': updateSyllabus,
  'update-table-personal-plan': updatePersonalPlanHours,
  
  // Вставка данных
  'insert-table-kafedra': sqlInsertIntoKAF,
  'insert-table-flows': sqlInsertIntoFlows,
  'insert-table-groups': sqlInsertIntoGroups,
  'insert-table-up': sqlInsertIntoUP,
  'insert-table-pp': sqlInsertIntoPP,
  'insert-table-disciplines': sqlInsertIntoDiscipline,
  'insert-table-types': sqlInsertIntoTypes,
  
  // Удаление данных
  'delete-table-kaf': deleteFromKaf,
  'delete-table-flows': deleteFromFlows,
  'delete-table-groups': deleteFromGroups,
  'delete-table-up': deleteFromUP,
  'delete-table-pp': deleteFromPP,
  'delete-table-types': deleteFromTypes,
  'delete-table-disciplines': deleteFromDisciplines
};

// Регистрация всех обработчиков
for (const [eventName, handler] of Object.entries(handlers)) {
  ipcMain.handle(eventName, createDataHandler(handler));
}

// Функции для работы с базой данных
function sqlInsertIntoKAF(data) {
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO kafedra (${columns.join()}) VALUES (${values.join()})`;
    
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
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO flows (${columns.join()}) VALUES (${values.join()})`;
    
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
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO groups (${columns.join()}) VALUES (${values.join()})`;
    
    database.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        resolve(err.message);
      }
      resolve("Данные о новой группе внесены.");
    });
  });
}

function sqlInsertIntoUP(data) {
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO syllabus (${columns.join()}) VALUES (${values.join()})`;
    
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
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO disciplines (${columns.join()}) VALUES (${values.join()})`;
    
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
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO types (${columns.join()}) VALUES (${values.join()})`;
    
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
  return new Promise((resolve) => {
    const { columns, values } = prepareDataForQuery(data);
    const sql = `INSERT INTO personal_plan (${columns.join()}) VALUES (${values.join()})`;
    
    database.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        resolve(err.message);
      }
      resolve("Данные о новом предмете в учебном плане внесены.");
    });
  });
}

// Функции обновления данных
function updatePersonal(data) {
  const { updates, id } = prepareUpdateData(data);
  return executeUpdate('kafedra', updates, id, `Данные для '${data['Фамилия']}' обновлены`);
}

function updateFlows(data) {
  const { updates, id } = prepareUpdateData(data, 'Flow_ID');
  return executeUpdate('flows', updates, id, `Данные для '${data.Наименование}' обновлены`);
}

function updateGroups(data) {
  const { updates, id } = prepareUpdateData(data, 'Group_ID');
  return executeUpdate('groups', updates, id, `Данные для '${data.Наименование}' обновлены`);
}

function updateUP(data) {
  const { updates, id } = prepareUpdateData(data, 'UP_ID');
  return executeUpdate('syllabus', updates, id, `Данные для '${data.id}' обновлены`);
}

function updatePersonalPlan(data) {
  return executeUpdate(
    'personal_plan',
    [`hours = ${data.Часы_преподавателя}`],
    `s_id = ${data.s_id} and p_id=${data.p_id}`,
    `Данные для '${data.s_id}' обновлены`
  );
}

function updateTypes(data) {
  return executeUpdate(
    'types',
    [`name = '${data.name}'`],
    `id = ${data.id}`,
    `Данные для '${data.name}' обновлены`
  );
}

function updateDisciplines(data) {
  return executeUpdate(
    'disciplines',
    [`name = '${data.name}'`],
    `id = ${data.id}`,
    `Данные для '${data.name}' обновлены`
  );
}

function updateSyllabus(data) {
  return executeUpdate(
    'syllabus',
    [
      `subgroups = '${data.subgroups}'`,
      `sub_hours = '${data.sub_hours}'`,
      `hours = '${data.hours}'`
    ],
    `id = ${data.id}`,
    `Данные для '${data.name}' обновлены`
  );
}

function updatePersonalPlanHours(data) {
  return executeUpdate(
    'personal_plan',
    [
      `subgroups = '${data.subgroups}'`,
      `hours = '${data.hours}'`
    ],
    `p_id = ${data.p_id} AND s_id = ${data.s_id}`,
    `Данные для '${data.name}' обновлены`
  );
}

function executeUpdate(table, updates, condition, successMessage) {
  return new Promise((resolve) => {
    const sql = `UPDATE ${table} SET ${updates.join(',')} WHERE ${condition}`;
    
    database.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(successMessage);
      resolve('Успешно');
    });
  });
}

// Функции удаления данных
function deleteFromKaf(data) {
  return executeDelete('kafedra', data.id, `Данные человека с ID: '${data.id}' удалены`);
}

function deleteFromFlows(data) {
  return executeDelete('flows', data.id, `Данные потока с ID: '${data.id}' удалены`);
}

function deleteFromGroups(data) {
  return executeDelete('groups', data.id, `Данные группы с ID: '${data.id}' удалены`);
}

function deleteFromUP(data) {
  return executeDelete('syllabus', data.id, `Данные предмета из учебного плана с ID: '${data.id}' удалены`);
}

function deleteFromPP(data) {
  return new Promise((resolve) => {
    const sql = `DELETE FROM personal_plan WHERE s_id = ${data.s_id} and p_id=${data.p_id}`;
    
    database.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`Данные предмета из учебного плана с ID: '${data.s_id}' удалены`);
      resolve('Успешно');
    });
  });
}

function deleteFromTypes(data) {
  return executeDelete('types', data.id, `Данные типа с ID: '${data.id}' удалены`);
}

function deleteFromDisciplines(data) {
  return executeDelete('disciplines', data.id, `Данные дисциплины с ID: '${data.id}' удалены`);
}

function executeDelete(table, id, successMessage) {
  return new Promise((resolve) => {
    const sql = `DELETE FROM ${table} WHERE id = ${id}`;
    
    database.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(successMessage);
      resolve('Успешно');
    });
  });
}

// Функции выборки данных
function sqlSelectAllFromTable(tableName) {
  return new Promise((resolve) => {
    const sql = `SELECT * FROM ${tableName}`;
    
    database.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      resolve(rows);
    });
  });
}

function getCurFlows() {
  return executeQuery(`
    SELECT 
      id,
      name,
      year,
      education_form
    FROM flows
  `);
}

function getCurGroups() {
  return executeQuery(`
    SELECT 
      groups.id,
      groups.flow_id,
      groups.name as name,
      groups.students_b,
      groups.students_nb,
      flows.name as flow
    FROM groups
    JOIN flows ON flows.id = groups.flow_id
  `);
}

function getCurDisciplines() {
  return executeQuery(`
    SELECT 
      id,
      name
    FROM disciplines
  `);
}

function getCurTypes() {
  return executeQuery(`
    SELECT 
      id,
      name
    FROM types
  `);
}

function getCurSyllabus() {
  return executeQuery(`
    SELECT 
      syllabus.id,
      flows.name AS flow,
      disciplines.name AS discipline,
      types.name AS type,
      syllabus.subgroups,
      syllabus.sub_hours,
      syllabus.hours,
      syllabus.semester
    FROM syllabus
    JOIN types ON types.id = syllabus.type
    JOIN disciplines ON disciplines.id = syllabus.discipline_id
    JOIN flows ON flows.id = syllabus.flow_id
  `);
}

function getActualFlowsForPersonalHours(data) {
  return executeQuery(`
    SELECT
      id, name
    FROM flows
    WHERE education_form = '${data.education_form}'
      AND year = '${data.year}'
  `);
}

function getActualSyllabusForPeronalHours(data) {
  return executeQuery(`
    SELECT
      syllabus.id AS syllabus_id,
      syllabus.discipline_id,
      disciplines.name AS discipline,
      flows.id AS flows_id,
      flows.name AS flows_name,
      syllabus.sub_hours,
      syllabus.subgroups,
      syllabus.hours,
      types.name AS type_name,
      types.id AS type_id,
      0 + (SELECT sum(pp.hours)
        FROM personal_plan pp
        JOIN syllabus s ON pp.s_id = s.id
        WHERE syllabus.id = pp.s_id
      ) AS used_hours
    FROM syllabus
    JOIN flows ON flows.id = syllabus.flow_id
    JOIN disciplines ON disciplines.id = syllabus.discipline_id
    JOIN types ON types.id = syllabus.type
    WHERE flows.year = '${data.year}'
      AND flows.education_form = '${data.education_form}'
      AND syllabus.id NOT IN (
        SELECT s_id
        FROM personal_plan
        WHERE p_id = ${data.p_id}
      )
  `);
}

function getCurPPDB() {
  return executeQuery(`
    SELECT 
      kafedra.id as 'id',
      kafedra.firstname as 'Имя',
      kafedra.secondname as 'Фамилия',
      kafedra.position as 'Должность',
      kafedra.hours as 'Нагрузка',
      0 + sum(personal_plan.hours) as 'Часы'
    FROM kafedra 
    LEFT JOIN personal_plan on kafedra.id=personal_plan.p_id
    GROUP BY kafedra.id, kafedra.firstName, kafedra.position, kafedra.hours
  `);
}

function getActualDataPPUP(data) {
  return executeQuery(`
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
        JOIN syllabus s ON pp.s_id = s.id
        WHERE syllabus.id = pp.s_id
      ) AS usedHours
    FROM syllabus
    JOIN flows ON syllabus.flow_id=flows.id
    JOIN disciplines ON disciplines.id = syllabus.discipline_id
    JOIN types ON types.id = syllabus.type
    WHERE year='${data.Год}'
      AND semester=${data.Семестр}
      AND education_form='${data.Форма_обучения}'
      AND syllabus.id NOT IN (
        SELECT s_id
        FROM personal_plan
        WHERE p_id = ${data.id}
      )
  `);
}

function getCurUpDB(data) {
  return executeQuery(`
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
    FROM syllabus 
    JOIN flows ON flows.id=syllabus.flow_id
    JOIN disciplines ON disciplines.id = syllabus.discipline_id
    WHERE flows.year='${data.Год}'
      AND syllabus.semester='${data.Семестр}'
      AND flows.education_form='${data.Форма_обучения}'
  `);
}

function getCurPersonalPlan(data) {
  return executeQuery(`
    SELECT 
      personal_plan.p_id AS pId,
      flows.id AS flowId,
      flows.name AS flowName,
      disciplines.id AS disciplineId,
      disciplines.name AS disciplineName,
      types.id AS typeId,
      types.name AS typeName,
      syllabus.semester AS semester,
      syllabus.hours AS hours,
      syllabus.sub_hours AS subHours,
      syllabus.id as s_id,
      personal_plan.hours AS personalHours,
      0 + (SELECT SUM(pp.hours)
        FROM syllabus s
        JOIN personal_plan pp ON s.id = pp.s_id
        WHERE s.id = syllabus.id
      ) AS totalHours
    FROM personal_plan
    JOIN syllabus ON personal_plan.s_id=syllabus.id
    JOIN flows ON syllabus.flow_id=flows.id
    JOIN disciplines ON disciplines.id = syllabus.discipline_id
    JOIN types ON syllabus.type = types.id
    WHERE personal_plan.p_id=${data.Personal_ID}
      AND syllabus.semester = ${data.Семестр}
      AND flows.year = '${data.Год}'
      AND flows.education_form = '${data.Форма_обучения}'
  `);
}

function getCurHoursTeachers(data) {
  return executeQuery(`
    SELECT 0 + sum(hours) as 'Часы'
    FROM personal_plan
    WHERE p_id=${data.Personal_ID}
    GROUP BY p_id
  `);
}

function getCurStatsTeachers(data) {
  return executeQuery(`
    SELECT 
      syllabus.p_id,
      kafedra.secondname,
      sum(personal_plan.hours)
    FROM ((personal_plan 
    JOIN syllabus ON personal_plan.s_id=syllabus.id)
    JOIN flows ON syllabus.flow_id=flows.id)
    JOIN kafedra ON personal_plan.p_id=kafedra.id
    WHERE syllabus.semester = ${data.Семестр}
      AND flows.year = '${data.Год}'
      AND flows.education_form = '${data.Форма_обучения}'
    GROUP BY syllabus.p_id, kafedra.firstname
  `);
}

function getCurTeachers() {
  return executeQuery(`
    SELECT 
      id,
      firstname,
      secondname,
      surname,
      salary
    FROM kafedra
  `);
}

function getCurListTeachers(data) {
  return executeQuery(`
    SELECT
      flows.name AS flowName,
      disciplines.name AS disciplineName,
      types.name AS typeName,
      personal_plan.subgroups,
      flows.year,
      flows.education_form,
      syllabus.semester AS semester,
      syllabus.hours AS hours,
      syllabus.sub_hours AS subHours,
      personal_plan.hours AS personalHours
    FROM personal_plan
    JOIN syllabus ON personal_plan.s_id=syllabus.id
    JOIN flows ON syllabus.flow_id=flows.id
    JOIN disciplines ON disciplines.id = syllabus.discipline_id
    JOIN types ON syllabus.type = types.id
    WHERE personal_plan.p_id = ${data.currentTeacher}
      AND flows.year = '${data.currentYear}'
      AND flows.education_form = '${data.currentFormOfEducation}'
  `);
}

function executeQuery(sql) {
  return new Promise((resolve) => {
    database.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      resolve(rows);
    });
  });
}

// Функции для работы со структурой базы данных
function checkAndCreateDatabase() {
  database.serialize(() => {
    database.run(`
      CREATE TABLE IF NOT EXISTS kafedra (
        id INTEGER,
        firstname TEXT NOT NULL,
        secondname REAL NOT NULL,
        surname TEXT,
        position TEXT,
        rank TEXT,
        academic TEXT,
        mail TEXT,
        phone REAL,
        gpd REAL,
        salary REAL,
        hours REAL,
        PRIMARY KEY (id),
        UNIQUE (firstname, secondname, surname)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS flows (
        id INTEGER NOT NULL,
        name TEXT NOT NULL,
        faculty TEXT NOT NULL,
        year TEXT NOT NULL,
        education_form TEXT NOT NULL,
        PRIMARY KEY (id)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER,
        flow_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        students_b INTEGER,
        students_nb INTEGER,
        PRIMARY KEY (id),
        FOREIGN KEY (flow_id) REFERENCES flows (id) ON DELETE CASCADE,
        UNIQUE (name)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS disciplines (
        id INTEGER,
        name TEXT NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (name)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS types (
        id INTEGER,
        name TEXT NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (name)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS syllabus (
        id INTEGER,
        flow_id INTEGER NOT NULL,
        discipline_id INTEGER NOT NULL,
        semester INTEGER,
        type INTEGER,
        subgroups INTEGER,
        sub_hours INTEGER,
        hours INTEGER,
        PRIMARY KEY (id),
        UNIQUE (flow_id, discipline_id, semester, type),
        FOREIGN KEY (type) REFERENCES types (id) ON DELETE CASCADE,
        FOREIGN KEY (flow_id) REFERENCES flows (id) ON DELETE CASCADE,
        FOREIGN KEY (discipline_id) REFERENCES disciplines (id) ON DELETE CASCADE
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS personal_plan (
        p_id INTEGER,
        s_id INTEGER,
        subgroups INTEGER NOT NULL,
        hours INTEGER NOT NULL,
        PRIMARY KEY (p_id, s_id),
        FOREIGN KEY (s_id) REFERENCES syllabus (id) ON DELETE CASCADE,
        FOREIGN KEY (p_id) REFERENCES kafedra (id) ON DELETE CASCADE
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS personal_hours (
        p_id INTEGER NOT NULL,
        year TEXT NOT NULL,
        hours INTEGER NOT NULL,
        PRIMARY KEY (p_id, year),
        FOREIGN KEY (p_id) REFERENCES kafedra (id) ON DELETE CASCADE
      )
    `);
    
    console.log(`Таблицы базы данных проверены и созданы.`);
  });
}