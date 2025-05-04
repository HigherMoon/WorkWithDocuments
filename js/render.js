let personalTableIsCreated = false;    // Проверка создана ли уже таблица с персональным планом
let currentData;                       // Текущие данные об преподаватеях
let currentSemester = 1;               // Текущий семестр (1, 2), по умолчанию - 1
let currentYear = "2025/2026";         // Текущий год, по умолчанию - 2025/2026
let currentFormOfEducation = "Очное";  // Текущая форма обучения (Очное, Заочное, Очно-заочное, Аспирантура) 
let currentPersonID = null;            // Текущий ID выбранного учителя
let currentPersonFIO = "";             // Текущее ФИО выбранного учителя 
let currentPersonData;                 // Текущая информация о преподавателе
let currentPersonalDataSQL;
let currentTableDataFromSQL = "";      
let currentSyllabusId = "";             
let currentUP_Hours = "";
let optionsList = {};

// Список значений для заголовка таблицы с преподавателями и их нагрузкой
const listHeadValuesPersonalTable = {
  "Преподаватель": "Фамилия",
  "Нагрузка": "Нагрузка",
}
// Список значений для заголовка таблицы персонального плана человека
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
})

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
  document.getElementById('infoSubGroups').innerHTML = `Всего подгрупп: ${curData["hours"] / curData["sub_hours"]}`;

  first.max = (curData["hours"] - curData["usedHours"]) / curData["sub_hours"];
  first.addEventListener("change", () => {
    console.log(curData)
    second.innerHTML = first.value;
    second.value = first.value;
    document.getElementById('hours-input').value = curData["sub_hours"] * second.value;
  })
})

const selectCurrentYear = document.getElementById("select-current-year");
selectCurrentYear.addEventListener("change", () => {
  currentYear = selectCurrentYear.value;
  console.log(currentYear);
})

const selectCurrentFormEducation = document.getElementById("select-current-form-education");
selectCurrentFormEducation.addEventListener("change", () => {
  currentFormOfEducation = selectCurrentFormEducation.value;
})

const selectCurrentSemester = document.getElementById("select-current-semester")
selectCurrentSemester.addEventListener("change", () => {
  currentSemester = selectCurrentSemester.value;
})

const buttonUpdateCurrentTableOfPerson = document.getElementById("current-data");
buttonUpdateCurrentTableOfPerson.addEventListener("click", () => {
  if (currentPersonFIO == "") {
    alert('Выберите преподавателя, чей учебный план надо вывести.')
  }
  else {
    data = updateSendingData();
    if (data.Personal_ID==null) {
      console.log('Нужно выбрать препода');
    }
    else showPersonalPlan(data);
  }
})


const buttonOpenAddCard = document.getElementById("open-add-card");
buttonOpenAddCard.addEventListener("click", () => {
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
      Форма_обучения: currentFormOfEducation,
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
})

const buttonCloseAddCard = document.getElementById("add-card-close");
buttonCloseAddCard.addEventListener("click", () => {
  console.log('закрыто');
  addCard.style.display = 'none';
  document.getElementById('hours-input').value="";
  document.getElementById('groupCount').value = "";
  document.getElementById("syllabus-input").value = "";
})

const buttonSaveAddCard = document.getElementById('save-add-card');
buttonSaveAddCard.addEventListener("click", () => {
  if (document.getElementById('groupCount').value == 0) {
    alert('НЕЛЬЗЯ ПОСТАВИТЬ 0');
    return false;
  }
  data = {
    p_id: currentPersonID,
    s_id: document.getElementById("syllabus-input").value,
    subgroups: document.getElementById('groupCount').value,
    hours: document.getElementById('hours-input').value,
  }
  window.electronAPI.insertPersonalPlan(data).then((answer) => {
    console.log(answer);
  });
  data = updateSendingData();
  if (data.Personal_ID==null) {
    console.log('Нужно выбрать препода');
  }
  else showPersonalPlan(data);
  console.log('закрыто');
  addCard.style.display = 'none';
  document.getElementById('hours-input').value="";
  document.getElementById('groupCount').value = "";
  document.getElementById("syllabus-input").value = "";
  getDataAndCreateTable();
})

///////////////////////////////////
//// Создание таблиц из SQL БД ////
///////////////////////////////////
function createTableFromDatabase(answerData) {    
  if (Object.keys(answerData).length == 0) {
    console.log("<!> Пустая база данных <!>");
    return false;
  };
  let table = document.createElement("table");
  table.id = "data-table";
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
            //col.innerHTML = `${curRow[listOfValues[name]]} [У других: ${curRow["totalHours"]} | Всего: ${curRow["hours"]}]`;
            col.innerHTML = curRow[listOfValues[name]];
          }
          else {
            col.innerHTML = curRow[listOfValues[name]];
          }
          if (listOfValues[name] == "personalHours") {
            edditableRow1 = col;
          }
          row.appendChild(col);
        }
        
        // Создание финальных кнопок
        let col = document.createElement("td");
        
        let deleteButton = document.createElement('button');
        let deleteButtonIcon = document.createElement('img');
        let acceptButton = document.createElement('button');
        let acceptButtonIcon = document.createElement('img');
        let editButton = document.createElement('button');
        let editButtonIcon = document.createElement('img');

        deleteButtonIcon.src = "../img/icon-delete.svg";
        deleteButtonIcon.classList.add("icon-img");
        deleteButton.addEventListener("click", () => {
          console.log(curRow)
          deleteData = {
            "p_id": currentPersonID,
            "s_id": curRow["s_id"],
          };
          console.log('aaaaa');
          console.log(deleteData);
          window.electronAPI.deletePersonalPlan(deleteData).then((answer) => {
            console.log(answer);
          });
          updatePersonalTable();
          getDataAndCreateTable();
        })
        deleteButton.appendChild(deleteButtonIcon);
        col.appendChild(deleteButton);


        acceptButtonIcon.src = "../img/icon-accept.svg";
        acceptButtonIcon.classList.add("icon-img");
        acceptButton.appendChild(acceptButtonIcon);
        acceptButton.addEventListener("click", () => {
          edditableRow1.setAttribute('contenteditable', false);
          edditableRow1.classList.remove("edit-cell");
          editButton.style.removeProperty("display");
          acceptButton.style.display = "none";
          console.log(curRow)
          updateData = {
            p_id: curRow['pId'],
            s_id: curRow['s_id'],
            subgroups: edditableRow1.innerHTML / curRow['subHours'],
            hours: edditableRow1.innerHTML,
          };
          console.log(updateData);
          window.electronAPI.updatePersonalHours(updateData).then((answer) => {
            console.log(answer)
          });
        });
        acceptButton.style.display = "none";
        col.appendChild(acceptButton);


        editButtonIcon.src = "../img/icon-pencil.png";
        editButtonIcon.classList.add("icon-img");
        editButton.appendChild(editButtonIcon);
        editButton.addEventListener("click", () => {
          edditableRow1.setAttribute('contenteditable', true);
          edditableRow1.classList.add("edit-cell");
          acceptButton.style.removeProperty("display");
          editButton.style.display = "none";
        });
        col.appendChild(editButton);
        row.appendChild(col);

        tbody.appendChild(row);
      }
      // Добавление СТРОКИ ДОБАВЛЕНИЯ в конец tbody
      let addRow = document.createElement("tr");
      let col = document.createElement("td");
      let buttonAddRow = document.createElement("button");
      col.setAttribute('colspan', '4');
      buttonAddRow.innerHTML = "+"
      buttonAddRow.classList.add("button-add-row");
      buttonAddRow.addEventListener("click", () => {
        addRow.remove();
        let newRow = document.createElement("tr");
        let newCol1 = document.createElement("td");
        let newCol2 = document.createElement("td");
        let newCol3 = document.createElement("td");
        let newCol4 = document.createElement("td");

        let inputSyllabus = document.createElement("input");
        inputSyllabus.id = "syllabus-input";
        inputSyllabus.list = "syllabus-input-helper";
        let inputSyllabusDatalist = document.createElement("datalist");
        inputSyllabusDatalist.id = "syllabus-input-helper";
        newCol1.appendChild(inputSyllabus);
        newCol1.appendChild(inputSyllabusDatalist);

        newCol2.innerHTML = "Должно подтягиваться автоматом";
        let div_select = document.createElement("div");
        div_select.id = "choose";
        let input = document.createElement("input");
        input.id = "groupCount";
        input.type = "range";
        input.min = "0";
        input.max = "0";
        input.value = "0";
        input.step = "1";
        div_select.appendChild(input);
        newCol3.appendChild(div_select);

        let noButton = document.createElement('button');
        let noButtonIcon = document.createElement('img');
        let yesButton = document.createElement('button');
        let yesButtonIcon = document.createElement('img');

        noButtonIcon.src = "../img/icon-delete.svg";
        noButtonIcon.classList.add("icon-img");
        noButton.appendChild(noButtonIcon);
        noButton.addEventListener("click", () => {
          newRow.remove();
        })
        newCol4.appendChild(noButton);

        yesButtonIcon.src = "../img/icon-accept.svg";
        yesButtonIcon.classList.add("icon-img");
        yesButton.appendChild(yesButtonIcon);
        yesButton.addEventListener("click", () => {
          console.log(newRow)
        });
        newCol4.appendChild(yesButton);

        newRow.appendChild(newCol1);
        newRow.appendChild(newCol2);
        newRow.appendChild(newCol3);
        newRow.appendChild(newCol4);

        table.append(newRow);
        table.append(addRow);
      });
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
}

// cоздание заголовка таблицы
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

// Обновление данных для получения перcонального плана
function updateSendingData() {
  return data = {
    Год: currentYear,
    Семестр: currentSemester,
    Форма_обучения: currentFormOfEducation,
    ФИО: currentPersonFIO,
    Personal_ID: currentPersonID
  }
}

// Получение перcонального плана и его вывод на странице
function getDataAndCreateTable() {
  window.electronAPI.getCurPPDatabase().then((data) => {
    currentPersonalDataSQL = data;
    createPersonalTableFromDatabase(data);
  });
}

function createPersonalTableFromDatabase(database) {
  if (Object.keys(database).length == 0) {
    console.log("Пустая бд");
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
      else showPersonalPlan(data);
    });
    table.appendChild(row);
  };
  containerPersonalTable.appendChild(table);
  personalTableIsCreated == true;
  console.log("Таблица с преподавателями создана.")
}

function clearContainerTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild)
}}

function updatePersonalTable() {
  data = updateSendingData();
  showPersonalPlan(data);
}

function checkAnswerData(answerData) {
  if (answerData.length==0) {
    let textEmptyTable = document.createElement("p");
    textEmptyTable.innerHTML = "Пустая таблица";
    containerTable.appendChild(textEmptyTable);
  }
  else createTableFromDatabase(answerData);
}

function showPersonalPlan(data) {
  window.electronAPI.getPersonalPlan(data).then((answerData) => {
    clearContainerTable();
    checkAnswerData(answerData);
  })
}

// Сайдбар
document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
})
