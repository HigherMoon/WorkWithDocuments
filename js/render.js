let personalTableIsCreated = false;    // Проверка создана ли уже таблица
let currentData;                       // Текущие данные
let currentSemester = 1;               // Текущий семестр (1, 2)
let currentYear = "2025/2026";         // Текущий год
let currentFormOfEducation = "Очное";  // Текущая форма обучения (Очное, Заочное, Очно-заочное, Аспирантура) 
let currentPersonID = null;
let currentPersonFIO = "";
let currentPersonData;                 // Текущая информация о преподавателе
let currentPersonalDataSQL;           
let currentTableDataFromSQL = "";
let currentSyllabusId = "";
let currentUP_Hours = ""

// Список значений для заголовка таблицы / полученные данные
const listHeadValuesPersonalTable = {
  // "ID": "id",
  "Преподаватель": "Фамилия",
  // "Должность": "Должность",
  "Нагрузка": "Нагрузка",
  // "Текущая нагрузка": "Часы",
  // "Текущая нагрузка (%)": "Загрузка"
}


getDataAndCreateTable();
window.electronAPI.getDatabaseStatus().then((data) => {
  console.log(`Путь: ${data.db_path}\nСтатус: ${data.err}`);
});


const pYear = document.getElementById("current-год");
const containerPersonalTable = document.getElementById("container-personal-table");
const containerTable = document.getElementById("container-data");
//const selectorPlan = document.getElementById("selector-plan");
const datalistSyllabus = document.getElementById("syllabus-input-helper");
const inputGroup = document.getElementById("group-input");
const addCard = document.getElementById('add-card');
const formAddCard = document.getElementById('new-pp-form');

//const buttonDialog = document.getElementById("openDialog").addEventListener("click", () => {
//  document.getElementById("testDialog").showModal();
//});

const selectCurrentYear = document.getElementById("select-current-год");
selectCurrentYear.addEventListener("change", () => {
  currentYear = selectCurrentYear.value;
});

const selectCurrentFormEducation = document.getElementById("select-current-form-education");
selectCurrentFormEducation.addEventListener("change", () => {
  currentFormOfEducation = selectCurrentFormEducation.value;
});

const selectCurrentSemester = document.getElementById("select-current-semester")
selectCurrentSemester.addEventListener("change", () => {
  currentSemester = selectCurrentSemester.value;
});





const buttonUpdateCurrentTableOfPerson = document.getElementById("current-data").addEventListener("click", () => {
  if (currentPersonFIO == "") { alert('Выберите преподавателя, чей учебный план надо вывести.') }
  else {
    data = updateSendingData();

    if (data.Personal_ID==null) {
      console.log('Нужно выбрать препода');
    }
    else {
      window.electronAPI.getCurPersonalPlan(data).then((answerData) => {
        clearContainerTable();
        console.log(answerData)
        checkAnswerData(answerData);
      });
    }}
});


const buttonOpenAddCard = document.getElementById("open-add-card").addEventListener("click", () => {
  if (currentPersonFIO=="") {
    alert('Выберите преподавателя, которому добавляется предмет')
  }
  else {
    document.getElementById('add-card-text').innerHTML = `Добавить предмет для ${currentPersonFIO}`;
    while(datalistSyllabus.firstChild) {
      datalistSyllabus.removeChild(datalistSyllabus.firstChild); 
    };
    dataTo = {
      Год: currentYear,
      Семестр: currentSemester,
      Форма_обучения: currentFormOfEducation
    }
    window.electronAPI.getActualDataPPUP(dataTo).then((data) => {
      console.log(dataTo);
      for (let index in data) {
        let objData = data[index];
        let newOption = document.createElement("option");
        newOption.value = objData["id"];
        newOption.innerHTML = `${objData['Поток']} | ${objData['name']} | ${objData['education_form']} | Всего часов: ${objData['hours']} `;
        datalistSyllabus.appendChild(newOption);
      }
    });
    addCard.style.display = 'block';
  }
});

const buttonCloseAddCard = document.getElementById("add-card-close").addEventListener("click", () => {
  console.log('закрыто')
  addCard.style.display = 'none';
  document.getElementById('hours-input').value="";
});

const buttonSaveAddCard = document.getElementById('save-add-card').addEventListener("click", () => {
  data = {
    p_id: currentPersonID,
    s_id: document.getElementById("syllabus-input").value,
    subgroups: document.getElementById('inputSubGroups').value,
    hours: document.getElementById('hours-input').value,
  }
  console.log(data)
  window.electronAPI.insertPPTable(data).then((answer) => {
    alert(answer)
  });
  data = updateSendingData();
  if (data.Personal_ID==null) {
    console.log('Нужно выбрать препода');
  }
  else {
    window.electronAPI.getCurPersonalPlan(data).then((answerData) => {
      clearContainerTable();
      checkAnswerData(answerData);
    });
  }
  inputGroup.value = null;
  inputHours.value = null;
  getDataAndCreateTable();
});

///////////////////////////////////
//// Создание таблиц из SQL БД ////
///////////////////////////////////

function createTableFromDatabase(database) {    
  if (Object.keys(database).length == 0) {
    console.log("<!> Пустая база данных <!>")
    return false;
  };
  let table = document.createElement("table");
  table.id = "data-table"
  // -- Создание заголовков таблицы --
  let headTable = document.createElement("thead");
  headTable.id = "head-table";

  let curPartData = database[0]
  for (let paramOfCurPartData in curPartData) {
    if (paramOfCurPartData == "s_id") { continue }
    let headRow = document.createElement("th");
    headRow.innerHTML = paramOfCurPartData;
    headRow.id = paramOfCurPartData;
    headRow.value = paramOfCurPartData;
    headTable.appendChild(headRow);
  };
  finalCell = document.createElement("th")
  finalCell.style.width = "70px"
  headTable.appendChild(finalCell);
  table.appendChild(headTable);

  for (let indexOfData in Object.keys(database)) {
    let row = document.createElement("tr");
    let curPartData = database[indexOfData];

    for (let paramOfCurPartData in curPartData) {
      if (paramOfCurPartData == "s_id") { continue }
      let col = document.createElement("td");
      col.innerHTML = curPartData[paramOfCurPartData];
      col.id = paramOfCurPartData;
      row.appendChild(col);
    };

    let col = document.createElement("td");
    let deleteButtonIcon = document.createElement('img');
    deleteButtonIcon.src = "../img/icon-delete.svg";
    deleteButtonIcon.classList.add("icon-img");
    deleteButtonIcon.addEventListener("click", () => {
      deleteData = {
        "p_id": currentPersonID,
        "s_id": curPartData["s_id"]
      }
      window.electronAPI.deletePPTable(deleteData).then((answer) => {
        console.log(answer);
      });
      updatePersonalTable();
      getDataAndCreateTable();
    })
    col.appendChild(deleteButtonIcon);
    row.appendChild(col);
    table.appendChild(row);
  };

   // Добавление таблицы на страницу
   containerTable.appendChild(table);
   console.log("Новая таблица создана.")
};

function updateSendingData() {
  return data = {
    Год: currentYear,
    Семестр: currentSemester,
    Форма_обучения: currentFormOfEducation,
    ФИО: currentPersonFIO,
    Personal_ID: currentPersonID
  }
}

function getDataAndCreateTable() {
  window.electronAPI.getCurPPDatabase().then((data) => {
    currentPersonalDataSQL = data;
    createPersonalTableFromDatabase(data);
  });
};

function createPersonalTableFromDatabase(database) {
  if (Object.keys(database).length == 0) {
    console.log("Пустая бд")
    return false;
  };
  while(containerPersonalTable.firstChild) {
    containerPersonalTable.removeChild(containerPersonalTable.firstChild); 
  }
  let table = document.createElement("table");
  let headTable = document.createElement("thead");
  table.id = "scroll-table-body";
  headTable.id = "head-table";

  for (let paramOfCurPartData in listHeadValuesPersonalTable) {
    if (paramOfCurPartData == "ID") { continue }
    let headRow = document.createElement("th");
    headRow.innerHTML = paramOfCurPartData;
    headRow.id = paramOfCurPartData;
    headTable.appendChild(headRow);
  }
  table.appendChild(headTable);
  
  for (let indexOfData in Object.keys(database)) {
    let row = document.createElement("tr");
    let curPartData = database[indexOfData];
    let personalLoad = 0;
    let currentLoad = 0;
    for (let headRowsValue in listHeadValuesPersonalTable) {
      if (headRowsValue == "ID") { continue }
      let col = document.createElement("td");
      if (listHeadValuesPersonalTable[headRowsValue] == "Нагрузка") {
        if (curPartData["Нагрузка"]==null) {
          col.innerHTML = "0 / 0";
          personalLoad = 0;
        }
        else {
          let hours = curPartData['Часы'] || 0;
          let load = curPartData['Нагрузка'] || 0;
          let deviation = (hours / load) * 100;
          col.innerHTML = `${hours} / ${load} (${deviation}%)`;
          if (deviation < 60) {
            col.style.backgroundColor='rgba(255, 200, 200)';
          }
          else if (deviation >=60 && deviation < 90) {
            col.style.backgroundColor='rgba(255, 211, 92)';
          }
          else if (deviation >= 90) {
            col.style.backgroundColor='rgba(80, 255, 132)';
          }
        }
      }
      else col.innerHTML = curPartData[listHeadValuesPersonalTable[headRowsValue]];
      col.id = headRowsValue;
      row.appendChild(col);
    };
    // -- При нажатии на строку выбирается текущая ФИО и ID препода
    row.addEventListener("click", () => {
      currentPersonID = curPartData["id"];
      currentPersonFIO = curPartData["Фамилия"];
      data = updateSendingData();
      if (data.Personal_ID==null) {
        console.log('Нужно выбрать препода');
      }
      else {
        window.electronAPI.getCurPersonalPlan(data).then((answerData) => {
          clearContainerTable();
          checkAnswerData(answerData);
        });
      }
    });
    table.appendChild(row);
  };
  containerPersonalTable.appendChild(table);
  personalTableIsCreated == true;
  console.log("Таблица с преподавателями создана.")
};

function clearContainerTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild)
}};

function updatePersonalTable() {
  data = updateSendingData();
  window.electronAPI.getCurPersonalPlan(data).then((answerData) => {
    clearContainerTable();
    checkAnswerData(answerData);
  });
}

function checkAnswerData(answerData) {
  if (answerData.length==0) {
    let textEmptyTable = document.createElement("p");
    textEmptyTable.innerHTML = "Пустая таблица";
    containerTable.appendChild(textEmptyTable);
  }
  else createTableFromDatabase(answerData);
}

document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});
