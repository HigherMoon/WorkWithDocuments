const containerTable = document.getElementById("container-table-flows");
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
const addCardFlows = document.getElementById("add-card-flows");
const addCardGroups = document.getElementById("add-card-groups");

const deleteCardFlows = document.getElementById('delete-card-flows');
const deleteCardTextFlows = document.getElementById('text-delete-card-flows');
const deleteCardGroups = document.getElementById('delete-card-groups');
const deleteCardTextGroups = document.getElementById('text-delete-card-groups');
let selectedID = null;

window.electronAPI.getDatabaseTable('Потоки').then((data) => {
  createTableFromDatabase(data, "container-table-flows");
});
window.electronAPI.getDatabaseTable('Группы').then((data) => {
  createTableFromDatabase(data, "container-table-groups");
});


/// Кнопки для потоков
const buttonOpenAddCardFlows = document.getElementById("open-add-card-flows").addEventListener("click", () => {
  addCardFlows.style.display = 'block';
});
const buttonCloseAddCardFlows = document.getElementById("add-card-close-flows").addEventListener("click", () => {
  console.log('закрыто')
  addCardFlows.style.display = 'none';
});
const secondButtonCloseAddCardFlows = document.getElementById("close-add-card-flows").addEventListener("click", ()=>{
  console.log('закрыто')
  addCardFlows.style.display = 'none';
});
const buttonSaveAddCardFlows = document.getElementById('save-add-card-flows').addEventListener("click", () => {
  data = {
    Наименование: document.getElementById('Наименование-f').value,
    Факультет: document.getElementById('Факультет-f').value,
    Год: document.getElementById('Год-f').value,
    Форма_обучения: document.getElementById('Форма_обучения-f').value
  }
  console.log(data)
  window.electronAPI.insertFlowsTable(data).then((answer) => {
    console.log(answer)
  });
  window.electronAPI.getDatabaseTable('Потоки').then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  addCardFlows.style.display = 'none';
});

const buttonOpenDeleteCardFlows = document.getElementById("open-delete-card-flows").addEventListener("click", () => {
  deleteCardTextFlows.innerHTML = `Вы точно хотите УДАЛИТЬ поток с ID = ${selectedID}?`;
  deleteCardFlows.style.display = 'block';
});
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
  window.electronAPI.getDatabaseTable('Потоки').then((data) => {
    createTableFromDatabase(data, "container-table-flows");
  });
  window.electronAPI.getDatabaseTable('Группы').then((data) => {
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
const secondButtonCloseAddCardGroups = document.getElementById("close-add-card-groups").addEventListener("click", ()=>{
  console.log('закрыто')
  addCardGroups.style.display = 'none';
});
const buttonSaveAddCardGroups = document.getElementById('save-add-card-groups').addEventListener("click", () => {
  data = {
    Наименование: document.getElementById('Наименование-g').value,
    Flow_ID: document.getElementById('Flow_ID-g').value,
    Студенты_Б: document.getElementById('Студенты_Б-g').value == "" ? 0 : document.getElementById('Студенты_Б-g').value,
    Студенты_ВБ: document.getElementById('Студенты_ВБ-g').value == "" ? 0 : document.getElementById('Студенты_ВБ-g').value
  }
  console.log(data)
  window.electronAPI.insertGroupsTable(data).then((answer) => {
    console.log(answer)
  });
  window.electronAPI.getDatabaseTable('Группы').then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
  addCardGroups.style.display = 'none';
});


const buttonOpenDeleteCardGroups = document.getElementById("open-delete-card-groups").addEventListener("click", () => {
  deleteCardTextGroups.innerHTML = `Вы точно хотите УДАЛИТЬ группу с ID = ${selectedID}?`;
  deleteCardGroups.style.display = 'block';
});
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
  window.electronAPI.getDatabaseTable('Группы').then((data) => {
    createTableFromDatabase(data, "container-table-groups");
  });
});




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
function createTableFromDatabase(database, containerID) {
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
    for (let paramOfCurPartData in curPartData) {
      let headRow = document.createElement("th");
      headRow.innerHTML = paramOfCurPartData;
      headRow.id = paramOfCurPartData;
      headTable.appendChild(headRow);
    };
    table.appendChild(headTable);
    // ---------------------------------
    // ----- Создание тела таблицы -----
    for (let indexOfData in Object.keys(database)) {
      let row = document.createElement("tr");
      let curPartData = database[indexOfData];
  
      for (let paramOfCurPartData in curPartData) {
        let col = document.createElement("td");
        if (paramOfCurPartData != 'Group_ID') {
          col.contentEditable = true;
        }
        col.innerHTML = curPartData[paramOfCurPartData];
        col.id = paramOfCurPartData;
        row.appendChild(col);
      };
      row.addEventListener("click", () => {
        if (containerID=='container-table-flows') {
          selectedID = row.children["Flow_ID"].innerHTML;
        };
        if (containerID=='container-table-groups') {
          selectedID = row.children["Group_ID"].innerHTML;
        }
      });
      table.appendChild(row);
    };
  
     // Добавление таблицы на страницу
    document.getElementById(containerID).appendChild(table);
    console.log("Новая таблица создана.")
};