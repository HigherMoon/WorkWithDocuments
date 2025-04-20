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
let currentUP_Hours = "";
let optionsList = {};

// Список значений для заголовка таблицы / полученные данные
const listHeadValuesPersonalTable = {
  "Преподаватель": "Фамилия",
  "Нагрузка": "Нагрузка",
}
const listHeadValuesPersonalPlanTable = {
  "Поток": "flowName",
  "Дисциплина": "disciplineName",
  "Тип": "typeName",
  "Общие Часы": "hours",
  "Часы на подгруппу": "subHours",
  "Текущая нагрузка": "personalHours",
}


getDataAndCreateTable();
window.electronAPI.getDatabaseStatus().then((data) => {
  console.log(`Путь: ${data.db_path}\nСтатус: ${data.err}`);
});


const pYear = document.getElementById("current-год");
const containerPersonalTable = document.getElementById("container-personal-table");
const containerTable = document.getElementById("container-data");
const datalistSyllabus = document.getElementById("syllabus-input-helper");
const inputGroup = document.getElementById("group-input");
const addCard = document.getElementById('add-card');
const formAddCard = document.getElementById('new-pp-form');

// Обновление колонки с выбором предмета
const syllabusInput = document.getElementById("syllabus-input");
syllabusInput.addEventListener("change", () => {
  curData = optionsList[syllabusInput.value]
  console.log(curData);
  if (curData["typeName"] in ["Лекция", "Практика", "Лабораторные занятия"]) {
    console.log('yes')
  }
  first = document.getElementById("groupCount");
  second = document.getElementById("selectedValue");

  document.getElementById('infoHours').innerHTML = `Всего часов: ${curData["hours"]}`;
  document.getElementById('infoSubHours').innerHTML = `Часов на подгруппу: ${curData["sub_hours"]}`;
  document.getElementById('infoUsedHours').innerHTML = `Часов ИСПОЛЬЗОВАНО: ${curData["usedHours"]}`;
  document.getElementById('infoSubGroups').innerHTML = ` Всего подгрупп: ${curData["hours"] / curData["sub_hours"]}`;

  first.max = (curData["hours"] - curData["usedHours"]) / curData["sub_hours"];
  first.addEventListener("change", () => {
    console.log(curData)
    second.innerHTML = first.value;
    second.value = first.value;
    document.getElementById('hours-input').value = curData["sub_hours"] * second.value;
  })
});

const selectCurrentYear = document.getElementById("select-current-год");
selectCurrentYear.addEventListener("change", () => {
  currentYear = selectCurrentYear.value;
  console.log(currentYear);
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
        console.log(answerData);
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
    currentYear = selectCurrentYear.value;
    dataTo = {
      id: currentPersonID,
      Год: currentYear,
      Семестр: currentSemester,
      Форма_обучения: currentFormOfEducation
    }
    window.electronAPI.getActualDataPPUP(dataTo).then((data) => {
      console.log(dataTo);
      for (let index in data) {
        let objData = data[index];
        console.log(objData)
        let newOption = document.createElement("option");
        newOption.value = objData["id"];
        newOption.innerHTML = `${objData['flow']} | ${objData['name']} | ${objData['education_form']} | ${objData['typeName']} | Всего часов: ${objData['hours']} `;
        datalistSyllabus.appendChild(newOption);
        optionsList[objData["id"]] = objData;
      }
    });
    addCard.style.display = 'block';
    console.log(optionsList)
  }
});

const buttonCloseAddCard = document.getElementById("add-card-close").addEventListener("click", () => {
  console.log('закрыто')
  addCard.style.display = 'none';
  document.getElementById('hours-input').value="";
  document.getElementById('groupCount').value = "";
  document.getElementById("syllabus-input").value = "";
});

const buttonSaveAddCard = document.getElementById('save-add-card').addEventListener("click", () => {
  if (document.getElementById('groupCount').value == 0) {
    alert('НЕЛЬЗЯ ПОСТАВИТЬ 0')
    return false;
  }
  data = {
    p_id: currentPersonID,
    s_id: document.getElementById("syllabus-input").value,
    subgroups: document.getElementById('groupCount').value,
    hours: document.getElementById('hours-input').value,
  }
  window.electronAPI.insertPPTable(data).then((answer) => {
    console.log(answer);
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
  };
  console.log('закрыто')
  addCard.style.display = 'none';
  document.getElementById('hours-input').value="";
  document.getElementById('groupCount').value = "";
  document.getElementById("syllabus-input").value = "";
  getDataAndCreateTable();
});


///////////////////////////////////
//// Создание таблиц из SQL БД ////
///////////////////////////////////
function createTableFromDatabase(answerData) {    
  if (Object.keys(answerData).length == 0) {
    console.log("<!> Пустая база данных <!>")
    return false;
  };
  let table = document.createElement("table");
  table.id = "data-table"
  // -- Создание заголовков таблицы --
  let headTable = document.createElement("thead");
  headTable.id = "head-table";
  
  result = {}
  for (let index in answerData) {
    curRow = answerData[index];
    if (!result[curRow["semester"]]) {
      result[curRow["semester"]] = {};
    }
    if (!result[curRow["semester"]][curRow["typeName"]]) {
      result[curRow["semester"]][curRow["typeName"]] = [];
    }
      result[curRow["semester"]][curRow["typeName"]].push(curRow);
  }
  console.log(result);
  for (const semester in result) {
    currentTimeTitle = document.createElement("p");
    currentTimeTitle.innerHTML = `Семестр: ${semester}, ${currentFormOfEducation} форма обучения`;
    currentTimeTitle.style.fontWeight = "bold";
    table = document.createElement("table");
    table.classList.add("A4Table");
    headFirst = createHeadRow();
    table.appendChild(headFirst);
    for (const type in result[semester]) {
      thead = document.createElement("thead");
      row = document.createElement("tr");
      th = document.createElement("th");
      th.innerHTML = `${type} по:`;
      th.setAttribute('colspan', '4');
      row.appendChild(th);
      thead.appendChild(row);
      table.appendChild(thead);

      listOfValues = [
        "disciplineName",
        "flowName",
        "personalHours",
      ]
      tbody = document.createElement("tbody");
      for (const index in result[semester][type]) {
        curRow = result[semester][type][index];
        row = document.createElement("tr");
        for (const name in listOfValues) {
          let col = document.createElement("td");
          if (listOfValues[name] == "personalHours") {
            col.innerHTML = `${curRow[listOfValues[name]]} [У других: ${curRow["totalHours"]} | Всего: ${curRow["hours"]}]`;
          }
          else {
            col.innerHTML = curRow[listOfValues[name]];
          }
          row.appendChild(col);
        }
        let col = document.createElement("td");
        let deleteButton = document.createElement('button');
        let deleteButtonIcon = document.createElement('img');
        deleteButtonIcon.src = "../img/icon-delete.svg";
        deleteButtonIcon.classList.add("icon-img");
        deleteButton.addEventListener("click", () => {
          console.log(curRow)
          deleteData = {
            "p_id": currentPersonID,
            "s_id": curRow["s_id"]
          };
          console.log('aaaaa')
          console.log(deleteData)
          window.electronAPI.deletePPTable(deleteData).then((answer) => {
            console.log(answer);
          });
          updatePersonalTable();
          getDataAndCreateTable();
        })
        deleteButton.appendChild(deleteButtonIcon);
        col.appendChild(deleteButton);

        let editButton = document.createElement('button');
        let editButtonIcon = document.createElement('img');
        editButtonIcon.src = "../img/icon-pencil.png";
        editButtonIcon.classList.add("icon-img");
        editButton.appendChild(editButtonIcon);
        col.appendChild(editButton);
        row.appendChild(col);
        tbody.appendChild(row);
      }
      // Добавление СТРОКИ ДОБАВЛЕНИЯ в конец tbody
      let addRow = document.createElement("tr");
      let col = document.createElement("td");
      col.setAttribute('colspan', '4');
      let buttonAddRow = document.createElement("button");
      buttonAddRow.innerHTML = "+"
      buttonAddRow.classList.add("button-add-row");
      col.appendChild(buttonAddRow);
      addRow.appendChild(col);
      addRow.id = "add-row";
      addRow.classList.add("text-align-center");
      tbody.appendChild(addRow);
      // Добавление tbody в таблицу
      table.appendChild(tbody);
    }
  }
   // Добавление таблицы на страницу
   containerTable.appendChild(table);
   console.log("Новая таблица создана.")
};


function createHeadRow() {
  head = document.createElement("thead")
  row = document.createElement("tr")
  
  col1 = document.createElement("td");
  col1.innerHTML = "Дисциплины";
  row.appendChild(col1);
  
  col2 = document.createElement("td");
  col2.innerHTML = "Поток";
  row.appendChild(col2);

  col3 = document.createElement("td");
  col3.innerHTML = "Часы";
  row.appendChild(col3);

  col4 = document.createElement("td");
  col4.innerHTML = "";
  row.appendChild(col4);

  head.appendChild(row);
  return head
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
      if (listHeadValuesPersonalTable[headRowsValue] == "Нагрузка") {
        if (curPartData["Нагрузка"]==null) {
          col.innerHTML = "0 / 0";
          personalLoad = 0;
        }
        else {
          let hours = curPartData['Часы'] || 0;
          let load = curPartData['Нагрузка'] || 0;
          let deviation = (hours / load) * 100;
          col.innerHTML = `${hours} / ${load} (${deviation.toFixed(2)}%)`;
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
      document.getElementById('infoFIO').innerHTML = `Выбран: ${currentPersonFIO}`;
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
