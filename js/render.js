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
let selectedPerson = null;
let addRowCreated = false;
let dictAddSyllabus = {};

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
const containerPersonalPlanTable = document.getElementById("container-data");
const datalistSyllabus = document.getElementById("syllabus-input-helper");
const inputGroup = document.getElementById("group-input");
const addCard = document.getElementById("add-card");
const formAddCard = document.getElementById("new-pp-form");

// Обновление колонки с выбором предмета
const syllabusInput = document.getElementById("syllabus-input");
syllabusInput.addEventListener("change", () => {
  curData = optionsList[syllabusInput.value]
  first = document.getElementById("groupCount");
  second = document.getElementById("selectedValue");

  document.getElementById("infoHours").innerHTML = `Всего часов: ${curData["hours"]}`;
  document.getElementById("infoSubHours").innerHTML = `Часов на подгруппу: ${curData["sub_hours"]}`;
  document.getElementById("infoUsedHours").innerHTML = `Часов ИСПОЛЬЗОВАНО: ${curData["usedHours"]}`;
  document.getElementById("infoSubGroups").innerHTML = `Всего подгрупп: ${curData["hours"] / curData["sub_hours"]}`;

  first.max = (curData["hours"] - curData["usedHours"]) / curData["sub_hours"];
  first.addEventListener("change", () => {
    console.log(curData)
    second.innerHTML = first.value;
    second.value = first.value;
    document.getElementById("hours-input").value = curData["sub_hours"] * second.value;
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

const buttonCloseAddCard = document.getElementById("add-card-close");
buttonCloseAddCard.addEventListener("click", () => {
  console.log("закрыто");
  addCard.style.display = "none";
  document.getElementById("hours-input").value="";
  document.getElementById("groupCount").value = "";
  document.getElementById("syllabus-input").value = "";
})

///////////////////////////////////
//// Создание таблиц из SQL БД ////
///////////////////////////////////
function createPersonalPlanTableContainer(answerData) {
  document.getElementById("text-personal-text").innerHTML = "Персональный план";
  let table = document.createElement("table");
  table.id = "data-table";
  
  if (Object.keys(answerData).length == 0) {
    console.log("<!> Пустая база данных <!>");
    return false;
  };

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
  // Заполнение данных
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
      th.setAttribute("colspan", "6");
      row.appendChild(th);
      thead.appendChild(row);
      table.appendChild(thead);

      listOfValues = [
        "disciplineName",
        "flowName",
        "personalHours",
        "totalHours",
        "hours",
      ]
      tbody = document.createElement("tbody");
      for (const index in result[semester][type]) {
        curRow = result[semester][type][index];
        let edditableRow1;
        row = document.createElement("tr");
        for (const name in listOfValues) {
          let col = document.createElement("td");
          if (listOfValues[name] == "totalHours") {
            //col.innerHTML = `${curRow[listOfValues[name]]} [У других: ${curRow["totalHours"]} | Всего: ${curRow["hours"]}]`;
            totalHours = curRow["totalHours"];
            if (totalHours == null) { totalHours = 0 };
            hours = curRow["hours"];
            col.innerHTML = hours - totalHours;
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
        
        let deleteButton = document.createElement("button");
        let deleteButtonIcon = document.createElement("img");
        let acceptButton = document.createElement("button");
        let acceptButtonIcon = document.createElement("img");
        let editButton = document.createElement("button");
        let editButtonIcon = document.createElement("img");

        let curCurRow = curRow;
        deleteButtonIcon.src = "../img/icon-delete.svg";
        deleteButtonIcon.classList.add("icon-img");
        deleteButton.addEventListener("click", () => {
          console.log(curCurRow)
          deleteData = {
            "p_id": currentPersonID,
            "s_id": curCurRow["s_id"],
          };
          window.electronAPI.deleteFromPersonalPlan(deleteData).then((answer) => {
            console.log(answer);
          });
          updatePersonalTable();
        })
        deleteButton.appendChild(deleteButtonIcon);
        col.appendChild(deleteButton);

        acceptButtonIcon.src = "../img/icon-accept.svg";
        acceptButtonIcon.classList.add("icon-img");
        acceptButton.appendChild(acceptButtonIcon);
        acceptButton.addEventListener("click", () => {
          edditableRow1.setAttribute("contenteditable", false);
          edditableRow1.classList.remove("edit-cell");
          editButton.style.removeProperty("display");
          acceptButton.style.display = "none";
          console.log(curRow)
          updateData = {
            p_id: curRow["pId"],
            s_id: curRow["s_id"],
            subgroups: edditableRow1.innerHTML / curRow["subHours"],
            hours: edditableRow1.innerHTML,
          };
          console.log(updateData);
          window.electronAPI.updatePersonalPlan(updateData).then((answer) => {
            console.log(answer)
          });
        });
        acceptButton.style.display = "none";
        col.appendChild(acceptButton);

        editButtonIcon.src = "../img/icon-pencil.png";
        editButtonIcon.classList.add("icon-img");
        editButton.appendChild(editButtonIcon);
        editButton.addEventListener("click", () => {
          edditableRow1.setAttribute("contenteditable", true);
          edditableRow1.classList.add("edit-cell");
          acceptButton.style.removeProperty("display");
          editButton.style.display = "none";
        });
        col.appendChild(editButton);
        row.appendChild(col);

        tbody.appendChild(row);
      }
      // Добавление СТРОКИ ДОБАВЛЕНИЯ в конец tbody
      let addRow = createAddRow(tbody);
      tbody.appendChild(addRow);
      // Добавление tbody в таблицу
      table.appendChild(tbody);
    }
  }
   // Добавление таблицы на страницу
   containerPersonalPlanTable.appendChild(table);
   console.log("Новая таблица создана.")
}

// cоздание заголовка таблицы
function createHeadRow() {
  head = document.createElement("thead");
  row = document.createElement("tr");
  row.classList.add("sticky-head");
  
  col1 = document.createElement("td");
  col1.innerHTML = "Дисциплина";
  row.appendChild(col1);
  
  col2 = document.createElement("td");
  col2.innerHTML = "Поток";
  row.appendChild(col2);

  col3 = document.createElement("td");
  col3.innerHTML = "Часы";
  row.appendChild(col3);

  col4 = document.createElement("td");
  col4.innerHTML = "Свободно";
  row.appendChild(col4);
  
  col5 = document.createElement("td");
  col5.innerHTML = "Всего";
  row.appendChild(col5);

  col6 = document.createElement("td");
  col6.innerHTML = "";
  row.appendChild(col6);

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
  window.electronAPI.getAllPersonalPlans().then((data) => {
    currentPersonalDataSQL = data;
    createTablePersonalHours(data);
  });
}

function createTablePersonalHours(database) {
  document.getElementById("text-personal-text").innerHTML = "";
  if (Object.keys(database).length == 0) {
    console.log("Пустая бд");
    return false;
  };
  
  // Очистка контейнера
  while(containerPersonalTable.firstChild) {
    containerPersonalTable.removeChild(containerPersonalTable.firstChild); 
  }
  
  let table = document.createElement("table");
  let headTable = document.createElement("thead");
  table.id = "scroll-table-body";
  headTable.id = "head-table";

  // Создание строки заголовков
  let headRow = document.createElement("tr");
  
  // Добавляем поле поиска только для столбца "Преподаватель"
  for (let paramOfCurPartData in listHeadValuesPersonalTable) {
    if (paramOfCurPartData == "ID") { continue }
    
    let headCell = document.createElement("th");
    headCell.id = paramOfCurPartData;
    
    if (paramOfCurPartData === "Преподаватель") {
      // Создаем контейнер для заголовка и поля поиска
      let searchContainer = document.createElement("div");
      searchContainer.style.display = "flex";
      searchContainer.style.alignItems = "center";
      searchContainer.style.gap = "5px";
      
      // Текст заголовка
      let headerText = document.createElement("span");
      headerText.textContent = paramOfCurPartData;
      searchContainer.appendChild(headerText);
      
      // Поле ввода для поиска
      let searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "Поиск...";
      searchInput.style.width = "120px";
      searchInput.style.padding = "3px";
      
      // Кнопка сброса поиска
      let resetButton = document.createElement("button");
      resetButton.innerHTML = "×";
      resetButton.style.display = "none";
      resetButton.style.background = "transparent";
      resetButton.style.border = "none";
      resetButton.style.cursor = "pointer";
      resetButton.style.fontSize = "16px";
      resetButton.style.padding = "0 5px";
      
      // Обработчик ввода текста
      searchInput.addEventListener("input", function() {
        const searchText = this.value.toLowerCase();
        if (searchText) {
          resetButton.style.display = "inline";
        } else {
          resetButton.style.display = "none";
        }
        
        // Фильтрация строк таблицы
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
          const nameCell = row.querySelector("td:first-child");
          if (nameCell) {
            const nameText = nameCell.textContent.toLowerCase();
            if (nameText.includes(searchText)) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          }
        });
      });
      
      // Обработчик сброса поиска
      resetButton.addEventListener("click", function() {
        searchInput.value = "";
        resetButton.style.display = "none";
        
        // Показываем все строки
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => row.style.display = "");
      });
      
      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(resetButton);
      headCell.appendChild(searchContainer);
    } else {
      // Обычный заголовок для других столбцов
      headCell.textContent = paramOfCurPartData;
    }
    
    headRow.appendChild(headCell);
  }
  
  headTable.appendChild(headRow);
  table.appendChild(headTable);

  // Создание тела таблицы
  let tbody = document.createElement("tbody");
  
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
          let hours = curPartData["Часы"] || 0;
          let load = curPartData["Нагрузка"] || 0;
          let deviation = (hours / load) * 100;
          col.innerHTML = `${hours} / ${load} (${deviation.toFixed(2)}%)`;
          if (deviation < 60) {
            col.style.backgroundColor="rgba(255, 200, 200)";
          }
          else if (deviation >=60 && deviation < 90) {
            col.style.backgroundColor="rgba(255, 211, 92)";
          }
          else if (deviation >= 90) {
            col.style.backgroundColor="rgba(80, 255, 132)";
          }
        }
      }
      else col.innerHTML = curPartData[listHeadValuesPersonalTable[headRowsValue]];
      col.id = headRowsValue;
      row.appendChild(col);
    };
    
    // Обработчик клика по строке
    row.addEventListener("click", () => {
      if (selectedPerson === row) {
        document.getElementById("text-personal-text").innerHTML = "";
        console.log("все выбраны");
        const allRows = table.querySelectorAll("tr");
        allRows.forEach(r => r.style.display = "");
        selectedPerson = null;
        addRowCreated = false;
        clearPersonalPlanContainer();
      }
      else {
        const allRows = table.querySelectorAll("tr");
        allRows.forEach(r => {
          if (r !== row) {
            r.style.display = "none";
          }
        })
        selectedPerson = row;
        currentPersonID = curPartData["id"];
        currentPersonFIO = curPartData["Фамилия"];
        data = updateSendingData();
        if (data.Personal_ID==null) {
          console.log("Нужно выбрать препода");
        }
        else showPersonalPlan(data);
      }
    });
    
    tbody.appendChild(row);
  };
  
  table.appendChild(tbody);
  containerPersonalTable.appendChild(table);
  personalTableIsCreated = true;
  console.log("Таблица с преподавателями создана.")
}

function clearPersonalPlanContainer() {
  while(containerPersonalPlanTable.firstChild) {
    containerPersonalPlanTable.removeChild(containerPersonalPlanTable.firstChild)
}}

function updatePersonalTable() {
  data = updateSendingData();
  showPersonalPlan(data);
}

function checkAndCreatePersonalHoursTable(answerData) {
  if (answerData.length==0) {
    let table = document.createElement("table");
    table.id = "data-table";
    table.classList.add("A4Table");

    let headFirst = createHeadRow();
    table.appendChild(headFirst);

    let tbody = document.createElement("tbody");
    let addRow = createAddRow(tbody);

    tbody.appendChild(addRow);
    table.appendChild(tbody);
    containerPersonalPlanTable.appendChild(table);
    document.getElementById("text-personal-text").innerHTML = "Персональный план";
  }
  else createPersonalPlanTableContainer(answerData);
}

function showPersonalPlan(data) {
  window.electronAPI.getPersonalPlan(data).then((answerData) => {
    clearPersonalPlanContainer();
    checkAndCreatePersonalHoursTable(answerData);
  })
}

function createAddRowFields() {
  let newRow = document.createElement("tr");
  let newCol1 = document.createElement("td");
  let newCol2 = document.createElement("td");
  let newCol3 = document.createElement("td");
  let newCol4 = document.createElement("td");
  let newCol5 = document.createElement("td");
  let newCol6 = document.createElement("td");

  const inputSyllabus = document.createElement("input");
  inputSyllabus.id = "syllabus-input";
  inputSyllabus.setAttribute("list", "syllabusInputHelper");
  let inputSyllabusDatalist = document.createElement("datalist");
  inputSyllabusDatalist.id = "syllabusInputHelper";
  let dataToSendSyllabus = {
    year: currentYear,
    education_form: currentFormOfEducation,
    p_id: currentPersonID,
  };
  let syllabusInfos = {};
  
  window.electronAPI.getCurrentSyllabusForPeronalHours(dataToSendSyllabus).then((answerData) => {
    for (let syllabusRowId in answerData) {
      let objData = answerData[syllabusRowId];
      let newOption = document.createElement("option");
      let usedHours = objData["used_hours"] || 0;
      let freeHours = objData["hours"] - usedHours;
      if (freeHours <= 0) { continue }
      let textValue = `${objData["flows_name"]} | ${objData["discipline"]} | ${objData["type_name"]} | Всего: ${objData["hours"]} / ${objData["sub_hours"]} | Свободно: ${freeHours}`;
      dictAddSyllabus[textValue] = objData["syllabus_id"];
      syllabusInfos[textValue] = objData;
      newOption.value = textValue;
      newOption.innerHTML = `${objData["syllabus_id"]}`;
      inputSyllabusDatalist.appendChild(newOption);
    }
  });

  // Создаем поле ввода часов заранее, но делаем его disabled
  let inputHours = document.createElement("input");
  inputHours.id = "groupCount";
  inputHours.type = "number";
  inputHours.min = "0";
  inputHours.value = "0";
  inputHours.disabled = true; // Изначально поле заблокировано
  inputHours.addEventListener("input", validateHoursInput);

  inputSyllabus.addEventListener("change", () => {
    if (!inputSyllabus.value) {
      inputHours.disabled = true;
      inputHours.value = "0";
      validateHoursInput();
      return;
    }
    
    // Разблокируем поле ввода часов при выборе предмета
    inputHours.disabled = false;
    
    let valueAddSyllabus = inputSyllabus.value;
    newCol2.innerHTML = valueAddSyllabus.split()[0];
    let usedHours = syllabusInfos[inputSyllabus.value]["used_hours"] || 0;
    inputHours.max = syllabusInfos[inputSyllabus.value]["hours"] - usedHours;
    inputHours.min = "0";
    inputHours.step = syllabusInfos[inputSyllabus.value]["sub_hours"];
    newCol4.innerHTML = syllabusInfos[inputSyllabus.value]["hours"] - usedHours;
    newCol5.innerHTML = syllabusInfos[inputSyllabus.value]["hours"];
    
    // Устанавливаем начальное значение
    inputHours.value = syllabusInfos[inputSyllabus.value]["sub_hours"] || "0";
    validateHoursInput();
  });

  newCol1.appendChild(inputSyllabusDatalist);
  newCol1.appendChild(inputSyllabus);

  newCol2.innerHTML = "—"; // Заглушка до выбора значения
  
  let divSelect = document.createElement("div");
  divSelect.id = "choose";
  divSelect.appendChild(inputHours);
  newCol3.appendChild(divSelect);

  let noButton = document.createElement("button");
  let noButtonIcon = document.createElement("img");
  let yesButton = document.createElement("button");
  let yesButtonIcon = document.createElement("img");

  noButtonIcon.src = "../img/icon-delete.svg";
  noButtonIcon.classList.add("icon-img");
  noButton.appendChild(noButtonIcon);
  noButton.addEventListener("click", () => {
    newRow.remove();
    addRowCreated = false;     
  });
  newCol6.appendChild(noButton);

  yesButtonIcon.src = "../img/icon-accept.svg";
  yesButtonIcon.classList.add("icon-img");
  yesButton.appendChild(yesButtonIcon);
  yesButton.id = "submit-hours-btn";
  yesButton.disabled = true; // Изначально кнопка заблокирована
  
  yesButton.addEventListener("click", () => {
    dataToAdd = {
      "p_id": currentPersonID,
      "s_id": syllabusInfos[inputSyllabus.value]["syllabus_id"],
      "hours": inputHours.value,
      "subgroups": inputHours.value / syllabusInfos[inputSyllabus.value]["sub_hours"],
    }
    window.electronAPI.insertPersonalPlan(dataToAdd).then((answer) => {
      data = updateSendingData();
      showPersonalPlan(data);
    });
    addRowCreated = false;
  });
  newCol6.appendChild(yesButton);

  function validateHoursInput() {
    const value = parseFloat(inputHours.value);
    const min = parseFloat(inputHours.min);
    const max = parseFloat(inputHours.max);
    
    if (isNaN(value)) {
      inputHours.value = min;
      yesButton.disabled = true;
      return;
    }
    
    if (value < min) {
      inputHours.value = min;
    } else if (value > max) {
      inputHours.value = max;
    }
    
    yesButton.disabled = (value <= 0 || inputHours.disabled);
    
    if (inputSyllabus.value && syllabusInfos[inputSyllabus.value]) {
      const subHours = syllabusInfos[inputSyllabus.value]["sub_hours"];
      if (subHours > 0 && value > 0) {
        const remainder = value % subHours;
        if (remainder !== 0) {
          inputHours.value = Math.floor(value / subHours) * subHours;
        }
      }
    }
  }

  newRow.appendChild(newCol1);
  newRow.appendChild(newCol2);
  newRow.appendChild(newCol3);
  newRow.appendChild(newCol4);
  newRow.appendChild(newCol5);
  newRow.appendChild(newCol6);
  
  return newRow;
}

function createAddRow(tbody) {
  let addRow = document.createElement("tr");
  let col = document.createElement("td");
  col.setAttribute("colspan", "6");
  col.innerHTML = "+"
  col.classList.add("button-add-row");


  
  col.addEventListener("click", () => {
    if (addRowCreated == true) {
      console.log("Нельзя добавить ещё")
      return false;
    }
    else {
      addRowCreated = true;
      addRow.remove();
      let newRow = createAddRowFields();
      tbody.append(newRow);
      tbody.append(addRow);
    }
  });
  addRow.appendChild(col);
  addRow.id = "add-row";
  addRow.classList.add("text-align-center");
  return addRow
}

document.getElementById("menu-toggle").addEventListener("click", function() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
})
