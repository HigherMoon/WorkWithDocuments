const addCard = document.getElementById('add-card');
const formAddCard = document.getElementById('new-teacher-form');
const deleteCard = document.getElementById('delete-card');
const deleteCardText = document.getElementById('text-delete-card');
const containerTable = document.getElementById("container-table-kaf");
let selectedID = null;

updateCurTable();

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
      let headRow = document.createElement("th");
      headRow.innerHTML = paramOfCurPartData;
      headRow.id = paramOfCurPartData;
      headTable.appendChild(headRow);
    };
    headTable.appendChild(document.createElement("th"));
    table.appendChild(headTable);

    // ----- Создание тела таблицы -----
    for (let indexOfData in Object.keys(database)) {
      let row = document.createElement("tr");
      let curPartData = database[indexOfData];
      for (let paramOfCurPartData in curPartData) {
        let col = document.createElement("td");
        if (paramOfCurPartData != "id") col.contentEditable = true;
        col.innerHTML = curPartData[paramOfCurPartData];
        col.id = paramOfCurPartData;
        row.appendChild(col);
      };
      let col = document.createElement("td");
      colbut = document.createElement("button");
      colbut.innerHTML = 'Удалить';
      colbut.addEventListener("click", () => {
        deleteData = { id: curPartData['id'] };
        window.electronAPI.deleteKafTable(deleteData).then((answer) => {
          console.log(answer)
        });
        //deleteCard.style.display = 'none';
        updateCurTable();
      });
      col.appendChild(colbut);
      row.appendChild(col);
      table.appendChild(row);
    };
    containerTable.appendChild(table);
    console.log("Новая таблица создана.")
  };

/*
const buttonUpdateKaf = document.getElementById("button-update-table-kaf").addEventListener("click", () => {
  let table = document.getElementById("data-table");
  let headTable = document.getElementById("head-table");

  let data = {};
  for (let i in headTable.children) {
    if (headTable.children[i].innerHTML != undefined)
      data[headTable.children[i].innerHTML] = "";
  }
  console.log("func \"saveCurrentDataFromTable\"")
  
  let countOftr = table.getElementsByTagName("tr").length;
  for (let i=0; i < countOftr; i++) {
    let current_tr = table.getElementsByTagName("tr")[i];
    let dataToSend = {};
    for (let j=0; j<current_tr.getElementsByTagName("td").length; j++) {
      let current_td = current_tr.getElementsByTagName("td")[j];
      dataToSend[current_td.id] = current_td.innerHTML;
    }
    window.electronAPI.updateKafTable(dataToSend).then((answer) => {
      console.log(answer)
    })}});
*/

const buttonOpenAddCard = document.getElementById("open-add-card").addEventListener("click", () => {
  addCard.style.display = 'block';
});
const buttonCloseAddCard = document.getElementById("add-card-close").addEventListener("click", () => {
  console.log('закрыто')
  addCard.style.display = 'none';
});
const secondButtonCloseAddCard = document.getElementById("close-add-card").addEventListener("click", ()=>{
  console.log('закрыто')
  addCard.style.display = 'none';
});
const buttonSaveAddCard = document.getElementById('save-add-card').addEventListener("click", () => {
  let errorNumber = 0;
  let errorText = "";
  let listOfReqCels = {
    "Фамилия-f": "Фамилию",
    "Имя-f": "Имя",
    "Отчество-f": "Отчество",
    "Нагрузка-f": "Нагрузку"
  };
  for (cell in listOfReqCels) {
    if (document.getElementById(cell).value=="") {
      errorNumber += 1;
      errorText += `Необходимо заполнить ${listOfReqCels[cell]}\n`
    }
  };
  if (errorNumber > 0) { alert(errorText) }
  else {
    data = {
      secondname: document.getElementById('Фамилия-f').value,
      firstname: document.getElementById('Имя-f').value,
      surname: document.getElementById('Отчество-f').value,
      hours: document.getElementById('Нагрузка-f').value,
      position: document.getElementById('Должность-f').value,
      rank: document.getElementById('Звание-f').value,
      academic: document.getElementById('Учёная_степень-f').value,
      phone: document.getElementById('Телефон-f').value,
      mail: document.getElementById('Почта-f').value,
      gpd: document.getElementById('ГПД-f').value,
      salary: document.getElementById('Ставка-f').value
    }
    console.log(data)
    window.electronAPI.insertKafTable(data).then((answer) => {
      console.log(answer)
    });
    updateCurTable();
  }
});

/*
const buttonOpenDeleteCard = document.getElementById("open-delete-card").addEventListener("click", () => {
  deleteCardText.innerHTML = `Вы точно хотите УДАЛИТЬ Преподавателя с ID = ${selectedID}?`;
  deleteCard.style.display = 'block';
});
*/
const buttonCloseDeleteCard = document.getElementById("delete-card-close").addEventListener("click", () => {
  console.log('закрыто')
  deleteCard.style.display = 'none';
});
const secondButtonCloseDeleteCard = document.getElementById("delete-card-close-2").addEventListener("click", ()=>{
  console.log('закрыто')
  deleteCard.style.display = 'none';
});

function updateCurTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild); 
  };
  window.electronAPI.getDatabaseTable('kafedra').then((data) => {
    createTableFromDatabase(data);
  });
}

document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});