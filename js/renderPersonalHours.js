let currentYear = "2025/2026";
let currentFormOfEducation = "Очное";
let currentTeacher = "";
let currentInfo = {};

const selectCurrentYear = document.getElementById("select-current-год");
selectCurrentYear.addEventListener("change", () => {
  currentYear = selectCurrentYear.value;
});
const selectCurrentFormEducation = document.getElementById("select-current-form-education");
selectCurrentFormEducation.addEventListener("change", () => {
  currentFormOfEducation = selectCurrentFormEducation.value;
});
const selectCurrentTeacher = document.getElementById("select-current-teacher");
selectCurrentTeacher.addEventListener("change", () => {
  currentTeacher = selectCurrentTeacher.value;
  console.log(currentTeacher);
});
const buttonGetData = document.getElementById("button-get-data");
buttonGetData.addEventListener("click", () => {
  list = document.getElementById("list");
  while(list.firstChild) { list.removeChild(list.firstChild) };
  dataToSend = {
    "currentYear": currentYear,
    "currentTeacher": currentTeacher,
    "currentFormOfEducation": currentFormOfEducation,
  };
  if (currentTeacher == "") {
    alert("Выберите преподавателя");
  }
  updateTeacherList(dataToSend);
});

// Обновление селектора с выводом доступных преподавателей
function updateSelectorTeachers() {
  while(selectCurrentTeacher.firstChild) { selectCurrentTeacher.removeChild(selectCurrentTeacher.firstChild) };
  window.electronAPI.getTeachers([]).then((answerData) => {
    console.log(answerData);
    let emptyOption = document.createElement("option");
    emptyOption.innerHTML = "";
    selectCurrentTeacher.appendChild(emptyOption);
    for (let index in answerData) {
      let objData = answerData[index];
      let newOption = document.createElement("option");
      newOption.value = objData["id"];
      newOption.innerHTML = `${objData['firstname']} ${objData['secondname']} ${objData['surname']}`;
      currentInfo[objData["id"]] = {
        "fio": `${objData['firstname']} ${objData['secondname']} ${objData['surname']}`,
        "salary": objData["salary"],
      }
      selectCurrentTeacher.appendChild(newOption);
    }
  });
}

// Создание заголовка для листа с информацией о преподавателе
function createHeadRow() {
  head = document.createElement("thead")
  row = document.createElement("tr")
  
  col1 = document.createElement("td");
  col1.innerHTML = "";
  row.appendChild(col1);
  
  col2 = document.createElement("td");
  col2.innerHTML = "Факультет, группы";
  row.appendChild(col2);

  col3 = document.createElement("td");
  col3.innerHTML = "Гр./с.";
  row.appendChild(col3);

  col4 = document.createElement("td");
  col4.innerHTML = "План";
  row.appendChild(col4);
  
  col5 = document.createElement("td");
  col5.innerHTML = "Итого";
  row.appendChild(col5);

  head.appendChild(row);
  return head
}

// Обновить лист с информацией о часах преподавателя
function updateTeacherList(data) {
  window.electronAPI.getCurrentListOfTeachers(data).then((answerData) => {
  if (Object.keys(answerData).length == 0) {
    alert('Данных нет')
    return false;
  };
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

  list = document.getElementById("list");
  while(list.firstChild) { list.removeChild(list.firstChild) };

  const currentTeacherTitle = document.createElement("p");
  const currentParamsTitle = document.createElement("p");
  console.log(currentInfo)
  currentTeacherTitle.innerHTML = `${data.currentYear} ${currentInfo[currentTeacher]["fio"]} - ${currentInfo[currentTeacher]["salary"]} ставки`;
  currentParamsTitle.innerHTML = `Часов за год: `;

  let totalHours = 0;

  list.appendChild(currentTeacherTitle);
  list.appendChild(currentParamsTitle);

  for (const semester in result) {
    currentTimeTitle = document.createElement("p");
    currentTimeTitle.innerHTML = `Семестр: ${semester}, ${currentFormOfEducation} форма обучения`;
    currentTimeTitle.style.fontWeight = "bold";
    list.appendChild(currentTimeTitle);
    table = document.createElement("table");
    headFirst = createHeadRow();
    table.appendChild(headFirst);
    table.classList.add("A4Table");
    for (const type in result[semester]) {
      thead = document.createElement("thead");
      row = document.createElement("tr");
      th = document.createElement("th");
      th.innerHTML = `${type} по:`;
      th.setAttribute('colspan', '5');
      row.appendChild(th);
      thead.appendChild(row);
      table.appendChild(thead);

      listOfValues = [
        "disciplineName",
        "flowName",
        "subgroups",
        "subHours",
        "personalHours",
      ]
      tbody = document.createElement("tbody");
      for (const index in result[semester][type]) {
        curRow = result[semester][type][index];
        row = document.createElement("tr");
        for (const name in listOfValues) {
          col = document.createElement("td");
          col.innerHTML = curRow[listOfValues[name]];
          if (listOfValues[name] == "personalHours") {
            totalHours += curRow[listOfValues[name]];
          };
          row.appendChild(col);
        };
        tbody.appendChild(row);
      };
      table.appendChild(tbody);
    };
    list.appendChild(table);
    currentParamsTitle.innerHTML = `Часов за год: ${totalHours}`;
  };
})};


// Открытие и закрытие бокового меню
document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});

// Запуск при старте
updateSelectorTeachers();