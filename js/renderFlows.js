const containerTable = document.getElementById("container-table-flows");
/*
const saveButtonTableFlows = document.getElementById("save-current-table-flows").addEventListener("click", () => {
  let table = document.getElementById(`table-container-table-flows`);
  let headTable = table.firstChild;
  
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
    window.electronAPI.updateFlowsTable(dataToSend).then((answer) => {
      console.log(answer)
    });
  } 
});
*/
const addCardFlows = document.getElementById("add-card-flows");
const addCardGroups = document.getElementById("add-card-groups");

const deleteCardFlows = document.getElementById('delete-card-flows');
const deleteCardTextFlows = document.getElementById('text-delete-card-flows');
const deleteCardGroups = document.getElementById('delete-card-groups');
const deleteCardTextGroups = document.getElementById('text-delete-card-groups');
let selectedID = null;


updateTables();


function updateTables() {
  window.electronAPI.getDatabaseTable('flows').then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  window.electronAPI.getCurGroups('').then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
};


/// Кнопки для потоков
const buttonOpenAddCardFlows = document.getElementById("open-add-card-flows").addEventListener("click", () => {
  addCardFlows.style.display = 'block';
});
const buttonCloseAddCardFlows = document.getElementById("add-card-close-flows").addEventListener("click", () => {
  console.log('закрыто')
  addCardFlows.style.display = 'none';
});
const buttonSaveAddCardFlows = document.getElementById('save-add-card-flows').addEventListener("click", () => {
  data = {
    name: document.getElementById('Наименование-f').value,
    faculty: document.getElementById('Факультет-f').value,
    year: document.getElementById('Год-f').value,
    education_form: document.getElementById('Форма_обучения-f').value
  }
  console.log(data)
  window.electronAPI.insertFlowsTable(data).then((answer) => {
    console.log(answer)
  });
  window.electronAPI.getDatabaseTable('flows').then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  addCardFlows.style.display = 'none';
});
/*
const buttonOpenDeleteCardFlows = document.getElementById("open-delete-card-flows").addEventListener("click", () => {
  deleteCardTextFlows.innerHTML = `Вы точно хотите УДАЛИТЬ поток с ID = ${selectedID}?`;
  deleteCardFlows.style.display = 'block';
});
*/
const buttonCloseDeleteCardFlows = document.getElementById("delete-card-close-flows").addEventListener("click", () => {
  console.log('закрыто')
  deleteCardFlows.style.display = 'none';
});
const secondButtonCloseDeleteCardFlows = document.getElementById("delete-card-close-2-flows").addEventListener("click", ()=>{
  console.log('закрыто')
  deleteCardFlows.style.display = 'none';
});
const buttonDeleteAddCardFlows = document.getElementById('confirm-delete-card-flows').addEventListener("click", () => {
  data = {
    Flow_ID: selectedID
  }
  window.electronAPI.deleteFlowsTable(data).then((answer) => {
    console.log(answer)
  });
  deleteCardFlows.style.display = 'none';
  window.electronAPI.getDatabaseTable('flows').then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  window.electronAPI.getCurGroups('').then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
});



/// Кнопки для групп
const buttonOpenAddCardGroups = document.getElementById("open-add-card-groups").addEventListener("click", () => {
  addCardGroups.style.display = 'block';
});
const buttonCloseAddCardGroups = document.getElementById("add-card-close-groups").addEventListener("click", () => {
  console.log('закрыто')
  addCardGroups.style.display = 'none';
});
const buttonSaveAddCardGroups = document.getElementById('save-add-card-groups').addEventListener("click", () => {
  data = {
    name: document.getElementById('Наименование-g').value,
    flow_id: document.getElementById('Flow_ID-g').value,
    students_b: document.getElementById('Студенты_Б-g').value == "" ? 0 : document.getElementById('Студенты_Б-g').value,
    students_nb: document.getElementById('Студенты_ВБ-g').value == "" ? 0 : document.getElementById('Студенты_ВБ-g').value
  }
  console.log(data)
  window.electronAPI.insertGroupsTable(data).then((answer) => {
    console.log(answer)
  });
  window.electronAPI.getCurGroups('').then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
  addCardGroups.style.display = 'none';
});

/*
const buttonOpenDeleteCardGroups = document.getElementById("open-delete-card-groups").addEventListener("click", () => {
  deleteCardTextGroups.innerHTML = `Вы точно хотите УДАЛИТЬ группу с ID = ${selectedID}?`;
  deleteCardGroups.style.display = 'block';
});
*/
const buttonCloseDeleteCardGroups = document.getElementById("delete-card-close-groups").addEventListener("click", () => {
  console.log('закрыто')
  deleteCardGroups.style.display = 'none';
});
const secondButtonCloseDeleteCardGroups = document.getElementById("delete-card-close-2-groups").addEventListener("click", ()=>{
  console.log('закрыто')
  deleteCardGroups.style.display = 'none';
});
const buttonDeleteAddCardGroups = document.getElementById('confirm-delete-card-groups').addEventListener("click", () => {
  data = {
    Group_ID: selectedID
  }
  window.electronAPI.deleteGroupsTable(data).then((answer) => {
    console.log(answer)
  });
  deleteCardGroups.style.display = 'none';
  window.electronAPI.getCurGroups('').then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
});



/*
const saveButtonTableGroups = document.getElementById("save-current-table-groups").addEventListener("click", () => {
  let table = document.getElementById("table-container-table-groups");
  let headTable = table.firstChild;

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
    window.electronAPI.updateGroupsTable(dataToSend).then((answer) => {
      console.log(answer)
    });
  } 
});
*/
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
      "education_form": "Форма образованеия"
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

  let curPartData = database[0]
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

  // ---------------------------------
  // ----- Создание тела таблицы -----
  for (let indexOfData in Object.keys(database)) {
    let row = document.createElement("tr");
    let curPartData = database[indexOfData];

    for (let paramOfCurPartData in dicts) {
      let col = document.createElement("td");
      if (paramOfCurPartData != 'Group_ID') {
        col.contentEditable = true;
      }
      col.innerHTML = curPartData[paramOfCurPartData];
      col.id = paramOfCurPartData;
      row.appendChild(col);
    };

    let col = document.createElement("td");
    let deleteButton = document.createElement('button');
    let deleteButtonIcon = document.createElement('img');
    deleteButtonIcon.src = "../img/icon-delete.svg";
    deleteButtonIcon.classList.add("icon-img");
    deleteButtonIcon.addEventListener("click", () => {
      deleteData = { id: curPartData['id'] };
      if (containerID=='container-table-groups') {
        window.electronAPI.deleteGroupsTable(deleteData).then((answer) => {
          console.log(answer)
      })}
      if (containerID=='container-table-flows') {
        window.electronAPI.deleteFlowsTable(deleteData).then((answer) => {
          console.log(answer)
      })}
      updateTables();
    });
    deleteButton.appendChild(deleteButtonIcon);
    col.appendChild(deleteButton);
    row.appendChild(col);

    let editButton = document.createElement('button');
      let editButtonIcon = document.createElement('img');
      editButtonIcon.src = "../img/icon-pencil.png";
      editButtonIcon.classList.add("icon-img");
      editButton.appendChild(editButtonIcon);
      col.appendChild(editButton);
      row.appendChild(col);

    table.appendChild(row);
  };

  document.getElementById(containerID).appendChild(table);
  console.log("Новая таблица создана.")
};

document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});