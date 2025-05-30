const containerTable = document.getElementById("container-table")

const addCard = document.getElementById("add-card");
const formAddCard = document.getElementById("new-up-form");
const deleteCard = document.getElementById("delete-card");
const deleteCardText = document.getElementById("text-delete-card");
const datalistFlows = document.getElementById("flows-input-helper");
const datalistDisciplines = document.getElementById("disciplines-input-helper");
const selectTypes = document.getElementById("Тип-f")
const inputGroup = document.getElementById("flows-input");
let selectedID = null;
let flowsDict = {};
let disciplineDict = {};

listOfValues = {
  "Семестр": "semester",
  "Поток": "flow",
  "Дисциплина": "discipline",
  "Тип": "type",
  "Подгруппы": "subgroups",
  "Часов на подгруппу": "sub_hours",
  "Всего часов": "hours",
};

window.electronAPI.getSyllabus([]).then((data) => {
  console.log(data)
  createTableFromDatabase(data);
});

const buttonOpenAddCard = document.getElementById("open-add-card").addEventListener("click", () => {
  while(datalistFlows.firstChild) {
    datalistFlows.removeChild(datalistFlows.firstChild); 
  };
  while(datalistDisciplines.firstChild) {
    datalistDisciplines.removeChild(datalistDisciplines.firstChild); 
  };
  while(selectTypes.firstChild) {
    selectTypes.removeChild(selectTypes.firstChild); 
  };
  
  dataTo={};
  window.electronAPI.getFlows(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.innerHTML = objData["id"];
      newOption.value = `${objData["name"]} | ${objData["year"]} | ${objData["education_form"]}`;
      flowsDict[`${objData["name"]} | ${objData["year"]} | ${objData["education_form"]}`] = objData["id"]
      datalistFlows.appendChild(newOption);
    }
  });
  window.electronAPI.getDisciplines(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.innerHTML = objData["id"];
      newOption.value = `${objData["name"]}`;
      disciplineDict[objData["name"]] = objData["id"]
      datalistDisciplines.appendChild(newOption);
    }
  });
  window.electronAPI.getTypes(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.value = objData["id"];
      newOption.innerHTML = `${objData["name"]}`;
      selectTypes.appendChild(newOption);
    }
  })
  addCard.style.display = "block";
});

const buttonCloseAddCard = document.getElementById("add-card-close-up").addEventListener("click", () => {
  addCard.style.display = "none";
  document.getElementById("flows-input").value = "";
  document.getElementById("Наименование-f").value = null;
  document.getElementById("Семестр-f").value = null;
  document.getElementById("Тип-f").value = null;
  document.getElementById("Часы_УП-f").value = null;
  document.getElementById("Часы-f").value = null;
});


const buttonSaveAddCard = document.getElementById("save-add-card").addEventListener("click", () => {
  var sub_hours = document.getElementById("Часы_УП-f").value;
  var hours = document.getElementById("Часы-f").value;
  console.log(sub_hours, hours ) 
  data = {
    flow_ID: flowsDict[document.getElementById("flows-input").value],
    discipline_id: disciplineDict[document.getElementById("Наименование-f").value],
    semester: document.getElementById("Семестр-f").value,
    type: document.getElementById("Тип-f").value,
    subgroups: document.getElementById("Часы-f").value / document.getElementById("Часы_УП-f").value,
    sub_hours: document.getElementById("Часы_УП-f").value,
    hours: document.getElementById("Часы-f").value
  }
  if (data.flow_ID=="" || data.discipline_id=="" ||
      data.type=="" || data.subgroups=="" ||
      data.sub_hours=="" || data.hours=="")
  {
    console.log(document.getElementById("flows-input").innerHTML)
    console.log(document.getElementById("Наименование-f").innerHTML)
    alert("Заполнить надо всё!")
  }
  else if (data.sub_hours<=0 || data.hours<=0) {
    alert("Часы не могут быть меньше или равны 0");
  }
  else {
    console.log(data)
    window.electronAPI.insertSyllabus(data).then((answer) => {
      console.log(answer)
    });
    window.electronAPI.getSyllabus("syllabus").then((data) => {
      createTableFromDatabase(data);
    });
    addCard.style.display = "none";
    document.getElementById("flows-input").value = null;
    document.getElementById("Наименование-f").value = null;
    document.getElementById("Семестр-f").value = null;
    document.getElementById("Тип-f").value = null;
    document.getElementById("Часы_УП-f").value = null;
    document.getElementById("Часы-f").value = null;
  }
});

const buttonCloseDeleteCard = document.getElementById("delete-card-close").addEventListener("click", () => {
  deleteCard.style.display = "none";
});
const secondButtonCloseDeleteCard = document.getElementById("delete-card-close-2").addEventListener("click", ()=>{
  deleteCard.style.display = "none";
});
const buttonDeleteAddCard = document.getElementById("confirm-delete-card").addEventListener("click", () => {
  data = {
    UP_ID: selectedID
  }
  window.electronAPI.deleteFromSyllabus(data).then((answer) => {
    console.log(answer)
  });
   deleteCard.style.display = "none";
   updateCurTable();
});

function updateCurTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild); 
  };
  window.electronAPI.getSyllabus([]).then((data) => {
    console.log(data)
    createTableFromDatabase(data);
  });
}

function createTableFromDatabase(database) {
    if (Object.keys(database).length == 0) {
      console.log("<!> Пустая база данных <!>")
      return false;
    };
    while(containerTable.firstChild) {
      containerTable.removeChild(containerTable.firstChild); 
    };
    let table = document.createElement("table");
    table.id = "data-table"
    // -- Создание заголовков таблицы --
    let headTable = document.createElement("thead");
    headTable.id = "head-table";
  
    for (let paramOfCurPartData in listOfValues) {
      let headRow = document.createElement("th");
      headRow.innerHTML = paramOfCurPartData;
      headRow.id = paramOfCurPartData;
      headTable.appendChild(headRow);
    };
    finalCell = document.createElement("th")
    finalCell.style.width = "100px"
    headTable.appendChild(finalCell);
    table.appendChild(headTable);
    // ---------------------------------
    // ----- Создание тела таблицы -----
    for (let indexOfData in Object.keys(database)) {
      let row = document.createElement("tr");
      let edditableRow1 = null;
      let edditableRow2 = null;
      let edditableRow3 = null;
      let curPartData = database[indexOfData];
      for (let paramOfCurPartData in listOfValues) {
        let col = document.createElement("td");
        col.innerHTML = curPartData[listOfValues[paramOfCurPartData]];
        col.id = listOfValues[paramOfCurPartData];
        if (paramOfCurPartData == "Подгруппы") {
          edditableRow1 = col;
        }
        if (paramOfCurPartData == "Часов на подгруппу") {
          edditableRow2 = col;
        }
        if (paramOfCurPartData == "Всего часов") {
          edditableRow3 = col;
        }
        row.appendChild(col);
      };
      // Создание финальных кнопок
      let col = document.createElement("td");

      let deleteButton = document.createElement("button");
      let deleteButtonIcon = document.createElement("img");
      let acceptButton = document.createElement("button");
      let acceptButtonIcon = document.createElement("img");
      let editButton = document.createElement("button");
      let editButtonIcon = document.createElement("img");

      deleteButtonIcon.src = "../img/icon-delete.svg";
      deleteButtonIcon.classList.add("icon-img");
      deleteButton.addEventListener("click", () => {
        deleteData = { id: curPartData["id"] };
        window.electronAPI.deleteFromSyllabus(deleteData).then((answer) => {
          console.log(answer);
        });
        updateCurTable()
      });
      deleteButton.appendChild(deleteButtonIcon);
      col.appendChild(deleteButton);
      row.appendChild(col);

      acceptButtonIcon.src = "../img/icon-accept.svg";
      acceptButtonIcon.classList.add("icon-img");
      acceptButton.appendChild(acceptButtonIcon);
      acceptButton.addEventListener("click", () => {
        edditableRow1.setAttribute("contenteditable", false);
        edditableRow1.classList.remove("edit-cell");
        edditableRow2.setAttribute("contenteditable", false);
        edditableRow2.classList.remove("edit-cell");
        edditableRow3.setAttribute("contenteditable", false);
        edditableRow3.classList.remove("edit-cell");
        editButton.style.removeProperty("display");
        acceptButton.style.display = "none";
        updateData = {
          id: curPartData["id"],
          subgroups: edditableRow1.innerHTML,
          sub_hours: edditableRow2.innerHTML,
          hours: edditableRow3.innerHTML,
        };
        console.log(updateData);
        window.electronAPI.updateSyllabus(updateData).then((answer) => {
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
        edditableRow2.setAttribute("contenteditable", true);
        edditableRow2.classList.add("edit-cell");
        edditableRow3.setAttribute("contenteditable", true);
        edditableRow3.classList.add("edit-cell");
        acceptButton.style.removeProperty("display");
        editButton.style.display = "none";
      });
      col.appendChild(editButton);
      row.appendChild(col);

      table.appendChild(row);
    };
  
    // Добавление таблицы на страницу
    containerTable.appendChild(table);
    console.log("Новая таблица создана.")
  };

document.getElementById("menu-toggle").addEventListener("click", function() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
});