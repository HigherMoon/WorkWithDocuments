let personalTableIsCreated = false;    // Проверка создана ли уже таблица
let currentData;                       // Текущие данные
let currentSemester = 1;               // Текущий семестр (1, 2)
let currentYear = "2023/2024";         // Текущий год
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
  "ID": "id",
  "Преподаватель": "Фамилия",
  "Должность": "Должность",
  "Нагрузка": "Нагрузка",
  "Текущая нагрузка": "Часы",
  "Текущая нагрузка (%)": "Загрузка"
}


getDataAndCreateTable();
window.electronAPI.getDatabaseStatus().then((data) => {
  console.log(`Путь: ${data.db_path}\nСтатус: ${data.err}`);
});


const pFIO = document.getElementById("current-ФИО");
const pYear = document.getElementById("current-год");
const containerPersonalTable = document.getElementById("container-personal-table");
const containerTable = document.getElementById("container-data-table");
//const selectorPlan = document.getElementById("selector-plan");
const datalistSyllabus = document.getElementById("syllabus-input-helper");
const inputGroup = document.getElementById("group-input");
const addCard = document.getElementById('add-card');
const formAddCard = document.getElementById('new-pp-form');

//const buttonDialog = document.getElementById("openDialog").addEventListener("click", () => {
//  document.getElementById("testDialog").showModal();
//});

const buttonChooseO = document.getElementById("button-o").addEventListener("click", () => {
  currentFormOfEducation = "Очное";
  updateInfoAboutCurrentSemesterAndFormEducation();
});
const buttonChooseZ = document.getElementById("button-z").addEventListener("click", () => {
  currentFormOfEducation = "Заочное";
  updateInfoAboutCurrentSemesterAndFormEducation();
});
const buttonChooseOZ = document.getElementById("button-oz").addEventListener("click", () => {
  currentFormOfEducation = "Очно-заочное";
  updateInfoAboutCurrentSemesterAndFormEducation();
});
const buttonChooseA = document.getElementById("button-a").addEventListener("click", () => {
  currentFormOfEducation = "Аспирантура";
  updateInfoAboutCurrentSemesterAndFormEducation(); 
});;
const buttonChooseSemester1 = document.getElementById("button-1-sem").addEventListener("click", () => {
  currentSemester = 1;
  updateInfoAboutCurrentSemesterAndFormEducation();
});
const buttonChooseSemester2 = document.getElementById("button-2-sem").addEventListener("click", () => {
  currentSemester = 2;
  updateInfoAboutCurrentSemesterAndFormEducation();
});

const buttonsFormsEducations = document.querySelectorAll('#container-buttons-form-education button');
buttonsFormsEducations.forEach(button => {
  button.addEventListener('click', function() {
    buttonsFormsEducations.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
  });
});
const buttonsSemesters = document.querySelectorAll('#container-buttons-semester button');
buttonsSemesters.forEach(button => {
  button.addEventListener('click', function() {
    buttonsSemesters.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
  });
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
  document.getElementById('group-input').value="";
  document.getElementById('hours-input').value="";
});
const secondButtonCloseAddCard = document.getElementById("close-add-card").addEventListener("click", ()=>{
  console.log('закрыто')
  addCard.style.display = 'none';
  document.getElementById('group-input').value="";
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

/*
const buttonDeletePP = document.getElementById("open-delete-card").addEventListener("click", ()=>{
  dataTo = {
    Personal_ID: currentPersonID,
    UP_ID: currentSyllabusId
  }  
  window.electronAPI.deletePPTable(dataTo).then((answer) => {
    console.log(answer)
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
  getDataAndCreateTable();
});

const buttonUpdatePP = document.getElementById("button-update-table-kaf").addEventListener("click", ()=>{
  let table = document.getElementById("data-table");
  let headTable = document.getElementById("head-table");

  let data = {};
  for (let i in headTable.children) {
    if (headTable.children[i].innerHTML != undefined)
      data[headTable.children[i].innerHTML] = "";
  }
  
  let countOftr = table.getElementsByTagName("tr").length;
  for (let i=0; i < countOftr; i++) {
    let current_tr = table.getElementsByTagName("tr")[i];
    let dataToSend = {};
    for (let j=0; j<current_tr.getElementsByTagName("td").length; j++) {
      let current_td = current_tr.getElementsByTagName("td")[j];
      dataToSend[current_td.id] = current_td.innerHTML;
    }
    dataToSend["p_id"] = currentPersonID;
    window.electronAPI.updatePPTable(dataToSend).then((answer) => {
      console.log(answer)
    });
  }
  
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
  getDataAndCreateTable();
});
*/
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
  headTable.appendChild(document.createElement("th"));
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
    colbut = document.createElement("button");
    colbut.innerHTML = 'Удалить';
    colbut.addEventListener("click", () => {
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
    col.appendChild(colbut);
    row.appendChild(col);
    table.appendChild(row);
  };

   // Добавление таблицы на страницу
   containerTable.appendChild(table);
   console.log("Новая таблица создана.")
};

function updateInfoAboutCurrentSemesterAndFormEducation() {
  pYear.innerHTML = currentYear;
}

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
      //if (paramOfCurPartData != "ID") col.contentEditable = true;
      if (listHeadValuesPersonalTable[headRowsValue] == "Нагрузка") {
        if (curPartData[listHeadValuesPersonalTable[headRowsValue]]==null) {
          col.innerHTML = 0;
          personalLoad = 0;
        }
        else {
          col.innerHTML = curPartData[listHeadValuesPersonalTable[headRowsValue]];
          personalLoad = col.innerHTML;
        }
      }
      else if (listHeadValuesPersonalTable[headRowsValue] == "Часы") {
        col.innerHTML = curPartData[listHeadValuesPersonalTable[headRowsValue]];
        if (curPartData[listHeadValuesPersonalTable[headRowsValue]]==null) {
          col.innerHTML = 0;
          currentLoad = 0;
        }
        currentLoad = col.innerHTML;
      }
      else if (listHeadValuesPersonalTable[headRowsValue] == "Загрузка") {
        col.innerHTML = (currentLoad)/(personalLoad) * 100;
        if (col.innerHTML < 60) {
          col.style.backgroundColor='rgba(255, 200, 200)';
        }
        else if (col.innerHTML >=60 && col.innerHTML < 90) {
          col.style.backgroundColor='rgba(255, 211, 92)';
        }
        else if (col.innerHTML >= 90) {
          col.style.backgroundColor='rgba(80, 255, 132)';
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
      pFIO.innerHTML = curPartData["Фамилия"];
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
