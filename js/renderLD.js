let personalTableIsCreated = false;  // Проверка создана ли уже таблица
let currentData;                     // Текущие данные


let currentSemester = 1;               // Текущий семестр (1, 2)
let currentYear = "2023/2024";         // Текущий год
let currentFormOfEducation = "Очное";  // Текущая форма обучения (Очное, Заочное, Очно-заочное, Аспирантура) 
let currentPersonData;                 // Текущая информация о преподавателе

let currentTableDataFromSQL = "";

const pFIO = document.getElementById("current-ФИО");
const pYear = document.getElementById("current-год");
const pSemesterAndFormEducation = document.getElementById("current-семестр");
const containerPersonalTable = document.getElementById("container-personal-table");
const selectorPlan = document.getElementById("selector-plan");
const datalistGroups = document.getElementById("group-input-helper");

const buttonChooseO = document.getElementById("button-o").addEventListener("click", () => {
  currentFormOfEducation = "Очное";
  updateInfoAboutCurrentSemesterAndFormEducation();
});
const buttonChooseZ = document.getElementById("button-z").addEventListener("click", () => {
  currentFormOfEducation = "Заочное";
  updateInfoAboutCurrentSemesterAndFormEducation();
});;
const buttonChooseOZ = document.getElementById("button-oz").addEventListener("click", () => {
  currentFormOfEducation = "Очно-заочное";
  updateInfoAboutCurrentSemesterAndFormEducation();
});;
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
const buttonAddSelectorPlan = document.getElementById("add-selector-plan").addEventListener("click", () => {
  console.log(selectorPlan.value)
});

let currentPersonalDataSQL;

window.electronAPI.getPersonalDatabase().then((data) => {
  currentPersonalDataSQL = data;
  createPersonalTableFromDatabase(data);
});






const listOfHeadRowsValues = {
    "Список преподавателей": "ФИО",
    "Должность": "Должность",
    "Доля ставки": "Доля_ставки",
    "Часы (max)": "Нагрузка",
    "Текущая нагрузка": "current_Нагрузка",
    "Загрузка (%)": "Загрузка"
}



function createPersonalTableFromDatabase(database) {
    if (Object.keys(database).length == 0) {
      console.log("Пустая бд")
      return false;
    };
    let table = document.createElement("table");
    table.id = "data-table"
    // Создание заголовков страницы
    let headTable = document.createElement("thead");
    headTable.id = "head-table";

    for (let paramOfCurPartData in listOfHeadRowsValues) {
      let headRow = document.createElement("th");
      headRow.innerHTML = paramOfCurPartData;
      headRow.id = paramOfCurPartData;
      headTable.appendChild(headRow);
    }
    table.appendChild(headTable);
    
    for (let indexOfData in Object.keys(database)) {
      let row = document.createElement("tr");
      let curPartData = database[indexOfData];

      for (let headRowsValue in listOfHeadRowsValues) {
        let col = document.createElement("td");
        //if (paramOfCurPartData != "ID") col.contentEditable = true;
        if (listOfHeadRowsValues[headRowsValue] == "current_Нагрузка" || 
            listOfHeadRowsValues[headRowsValue] == "Загрузка") {
            col.innerHTML = ""
        }
        else col.innerHTML = curPartData[listOfHeadRowsValues[headRowsValue]];
        col.id = headRowsValue;
        row.appendChild(col);
      };

      row.addEventListener("click", () => {
        pFIO.innerHTML = row.children["Список преподавателей"].innerHTML;
      });

      table.appendChild(row);
    };
    containerPersonalTable.appendChild(table);
    personalTableIsCreated == true;
    console.log("Таблица с персоналом создана.")
};

function updateInfoAboutCurrentSemesterAndFormEducation() {
  pSemesterAndFormEducation.innerHTML = `${currentSemester} Семестр, ${currentFormOfEducation}`;
  pYear.innerHTML = currentYear;
}
