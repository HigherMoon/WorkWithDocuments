const containerTable = document.getElementById("container-table-flows");
const addCardFlows = document.getElementById("add-card-flows");
const addCardGroups = document.getElementById("add-card-groups");

const deleteCardFlows = document.getElementById("delete-card-flows");
const deleteCardTextFlows = document.getElementById("text-delete-card-flows");
const deleteCardGroups = document.getElementById("delete-card-groups");
const deleteCardTextGroups = document.getElementById("text-delete-card-groups");
let selectedID = null;

updateTables();
function updateTables() {
  window.electronAPI.getAllFromTable("flows").then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  window.electronAPI.getGroups("").then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
};

/// Кнопки для потоков
const buttonOpenAddCardFlows = document.getElementById("open-add-card-flows").addEventListener("click", () => {
  addCardFlows.style.display = "block";
});
const buttonCloseAddCardFlows = document.getElementById("add-card-close-flows").addEventListener("click", () => {
  addCardFlows.style.display = "none";
});
const buttonSaveAddCardFlows = document.getElementById("save-add-card-flows").addEventListener("click", () => {
  let nameField = document.getElementById("name-input-flow");
  let flowIdField = document.getElementById("faculty-input-flow");
  let yearField = document.getElementById("year-input-flow");
  let educationFormField = document.getElementById("education-form-input-flow");
  data = {
    "name": nameField.value,
    "faculty": flowIdField.value,
    "year": yearField.value,
    "education_form": educationFormField.value
  }
  nameField.value = "";
  flowIdField.value = "";
  yearField.value = "";
  educationFormField.value = "";
  window.electronAPI.insertFlow(data).then((answer) => {
    console.log(answer)
  });
  window.electronAPI.getAllFromTable("flows").then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  addCardFlows.style.display = "none";
});

const buttonCloseDeleteCardFlows = document.getElementById("delete-card-close-flows").addEventListener("click", () => {
  deleteCardFlows.style.display = "none";
});

const secondButtonCloseDeleteCardFlows = document.getElementById("delete-card-close-2-flows").addEventListener("click", ()=>{
  deleteCardFlows.style.display = "none";
});

const buttonDeleteAddCardFlows = document.getElementById("confirm-delete-card-flows").addEventListener("click", () => {
  data = {
    Flow_ID: selectedID
  }
  window.electronAPI.deleteFlow(data).then((answer) => {
    console.log(answer)
  });
  deleteCardFlows.style.display = "none";
  window.electronAPI.getAllFromTable("flows").then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  window.electronAPI.getGroups("").then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
});

/// Кнопки для групп
const buttonOpenAddCardGroups = document.getElementById("open-add-card-groups").addEventListener("click", () => {
  addCardGroups.style.display = "block";
});
const buttonCloseAddCardGroups = document.getElementById("add-card-close-groups").addEventListener("click", () => {
  addCardGroups.style.display = "none";
});
const buttonSaveAddCardGroups = document.getElementById("save-add-card-groups").addEventListener("click", () => {
  let nameField = document.getElementById("name-input-group");
  let flowIdField = document.getElementById("flow-id-input-group");
  let studentsBField = document.getElementById("students-b-group");
  let studentsNBField = document.getElementById("students-nb-group");
  data = {
    name: nameField.value,
    flow_id: flowIdField.value,
    students_b: studentsBField.value == "" ? 0 : studentsBField.value,
    students_nb: studentsNBField.value == "" ? 0 : studentsNBField.value
  }
  nameField.value = "";
  flowIdField.value = "";
  studentsBField = "";
  studentsNBField = "";
  window.electronAPI.insertGroup(data).then((answer) => {
    console.log(answer)
  });
  window.electronAPI.getGroups("").then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
  addCardGroups.style.display = "none";
});

const buttonCloseDeleteCardGroups = document.getElementById("delete-card-close-groups").addEventListener("click", () => {
  deleteCardGroups.style.display = "none";
});

const secondButtonCloseDeleteCardGroups = document.getElementById("delete-card-close-2-groups").addEventListener("click", ()=>{
  deleteCardGroups.style.display = "none";
});

const buttonDeleteAddCardGroups = document.getElementById("confirm-delete-card-groups").addEventListener("click", () => {
  data = {
    Group_ID: selectedID
  }
  window.electronAPI.deleteGroup(data).then((answer) => {
    console.log(answer)
  });
  deleteCardGroups.style.display = "none";
  window.electronAPI.getGroups("").then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
});

function createTableFromDatabase(database, containerID) {
  if (containerID == "container-table-groups") {
    dicts = {
      "flow": "Поток",
      "name": "Наименование",
      "students_b": "Студенты (бюджет)",
      "students_nb": "Студенты (не бюджет)"
    }
  }
  else {
    dicts = {
      "id": "id потока",
      "name": "Название",
      "faculty": "Факультет",
      "year": "Год",
      "education_form": "Форма образования"
    }
  }
  if (Object.keys(database).length == 0) {
    console.log("<!> Пустая база данных <!>")
    return false;
  };
  containerTableN = document.getElementById(containerID);
  while(containerTableN.firstChild) {
    containerTableN.removeChild(containerTableN.firstChild); 
  };
  let table = document.createElement("table");
  table.id = `table-${containerID}`
  // -- Создание заголовков таблицы --
  
  let headTable = document.createElement("thead");
  headTable.id = "head-table";

  for (let paramOfCurPartData in dicts) {
    let headRow = document.createElement("th");
    headRow.innerHTML = dicts[paramOfCurPartData];
    headRow.id = paramOfCurPartData;
    headTable.appendChild(headRow);
  };
  finalCell = document.createElement("th")
  finalCell.style.width = "100px"
  headTable.appendChild(finalCell);
  table.appendChild(headTable);

  // ----- Создание тела таблицы -----
  for (let indexOfData in Object.keys(database)) {
    let row = document.createElement("tr");
    let editableColumnGroups1 = null;
    let editableColumnGroups2 = null;
    let editableColumnGroups3 = null;
    let editableColumnFlows1 = null;
    let editableColumnFlows2 = null;
    let curPartData = database[indexOfData];
    for (let paramOfCurPartData in dicts) {
      let col = document.createElement("td");
      col.innerHTML = curPartData[paramOfCurPartData];
      col.id = paramOfCurPartData;
      if (containerID == "container-table-groups") {
        if (paramOfCurPartData == "name") {
          editableColumnGroups1 = col;
        }
        if (paramOfCurPartData == "students_b") {
          editableColumnGroups2 = col;
        }
        if (paramOfCurPartData == "students_nb") {
          editableColumnGroups3 = col;
        }
      }
      else {
        if (paramOfCurPartData == "name") {
          editableColumnFlows1 = col;
        }
        if (paramOfCurPartData == "faculty") {
          editableColumnFlows2 = col;
        }
      }
      row.appendChild(col);
    };

    let acceptButton = document.createElement("button");
    let acceptButtonIcon = document.createElement("img");

    let col = document.createElement("td");
    let deleteButton = document.createElement("button");
    let deleteButtonIcon = document.createElement("img");
    deleteButtonIcon.src = "../img/icon-delete.svg";
    deleteButtonIcon.classList.add("icon-img");
    deleteButtonIcon.addEventListener("click", () => {
      deleteData = { id: curPartData["id"] };
      if (containerID == "container-table-groups") {
        window.electronAPI.deleteGroup(deleteData).then((answer) => {
          console.log(answer)
      })}
      if (containerID == "container-table-flows") {
        window.electronAPI.deleteFlow(deleteData).then((answer) => {
          console.log(answer)
      })}
      updateTables();
    });
    deleteButton.appendChild(deleteButtonIcon);
    col.appendChild(deleteButton);
    row.appendChild(col);

    acceptButtonIcon.src = "../img/icon-accept.svg";
    acceptButtonIcon.classList.add("icon-img");
    acceptButton.appendChild(acceptButtonIcon);
    acceptButton.addEventListener("click", () => {
      if (containerID == "container-table-groups") {
        editableColumnGroups1.setAttribute("contenteditable", false);
        editableColumnGroups1.classList.remove("edit-cell");
        editableColumnGroups2.setAttribute("contenteditable", false);
        editableColumnGroups2.classList.remove("edit-cell");
        editableColumnGroups3.setAttribute("contenteditable", false);
        editableColumnGroups3.classList.remove("edit-cell");
        editButton.style.removeProperty("display");
        acceptButton.style.display = "none";
        updateData = {
          id: curPartData["id"],
          name: editableColumnGroups1.innerHTML,
          students_b: editableColumnGroups2.innerHTML,
          students_nb: editableColumnGroups3.innerHTML,
        };
        window.electronAPI.updateGroup(updateData).then((answer) => {
          console.log(answer)
        });
      }
      else {
        editableColumnFlows1.setAttribute("contenteditable", false);
        editableColumnFlows1.classList.remove("edit-cell");
        editableColumnFlows2.setAttribute("contenteditable", false);
        editableColumnFlows2.classList.remove("edit-cell");
        editButton.style.removeProperty("display");
        acceptButton.style.display = "none";
        updateData = {
          id: curPartData["id"],
          name: editableColumnFlows1.innerHTML,
          faculty: editableColumnFlows2.innerHTML,
        };
        console.log(updateData)
        window.electronAPI.updateFlow(updateData).then((answer) => {
          console.log(answer)
        });
      }
      updateTables();
    });
    acceptButton.style.display = "none";
    col.appendChild(acceptButton);

    let editButton = document.createElement("button");
    let editButtonIcon = document.createElement("img");
    editButtonIcon.src = "../img/icon-pencil.png";
    editButtonIcon.classList.add("icon-img");
    editButton.addEventListener("click", () => {
      if (containerID == "container-table-groups") {
        editableColumnGroups1.setAttribute("contenteditable", true);
        editableColumnGroups1.classList.add("edit-cell");
        editableColumnGroups2.setAttribute("contenteditable", true);
        editableColumnGroups2.classList.add("edit-cell");
        editableColumnGroups3.setAttribute("contenteditable", true);
        editableColumnGroups3.classList.add("edit-cell");
      }
      else {
        editableColumnFlows1.setAttribute("contenteditable", true);
        editableColumnFlows1.classList.add("edit-cell");
        editableColumnFlows2.setAttribute("contenteditable", true);
        editableColumnFlows2.classList.add("edit-cell");
      }
      acceptButton.style.removeProperty("display");
      editButton.style.display = "none";
    });
    editButton.appendChild(editButtonIcon);
    col.appendChild(editButton);
    row.appendChild(col);

    table.appendChild(row);
  };

  document.getElementById(containerID).appendChild(table);
  console.log("Новая таблица создана.")
};

document.getElementById("menu-toggle").addEventListener("click", function() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
});