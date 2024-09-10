const addCard = document.getElementById('add-card');
const formAddCard = document.getElementById('new-teacher-form');
const deleteCard = document.getElementById('delete-card');
const deleteCardText = document.getElementById('text-delete-card');
const containerTable = document.getElementById("container-table-kaf");
let selectedID = null;

window.electronAPI.getDatabaseTable('Кафедра').then((data) => {
    createTableFromDatabase(data);
  });

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
    table.appendChild(headTable);
    // ---------------------------------
    // ----- Создание тела таблицы -----
    for (let indexOfData in Object.keys(database)) {
      let row = document.createElement("tr");
      let curPartData = database[indexOfData];
  
      for (let paramOfCurPartData in curPartData) {
        let col = document.createElement("td");
        if (paramOfCurPartData != "Personal_ID") col.contentEditable = true;
        col.innerHTML = curPartData[paramOfCurPartData];
        col.id = paramOfCurPartData;
        row.appendChild(col);
      };
      row.addEventListener("click", () => {
        selectedID = row.children["Personal_ID"].innerHTML;
      });
      table.appendChild(row);
    };
    // ---------------------------------
    // Добавление таблицы на страницу
    containerTable.appendChild(table);
    console.log("Новая таблица создана.")
  };
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
    });
  } 
});


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
  if (document.getElementById('Нагрузка-f').value=="" && document.getElementById('ФИО-f').value=="") {
    alert('Укажите ФИО и нагрузку!')
  }
  else if (document.getElementById('ФИО-f').value=="") {
    alert('Введите ФИО!')
  }
  else if (document.getElementById('Нагрузка-f').value=="") {
    alert('Укажите нагрузку!')
  }
  else{
    data = {
      ФИО: document.getElementById('ФИО-f').value,
      Часы: document.getElementById('Нагрузка-f').value,
      Должность: document.getElementById('Должность-f').value,
      Звание: document.getElementById('Звание-f').value,
      Учёная_степень: document.getElementById('Учёная_степень-f').value,
      Телефон: document.getElementById('Телефон-f').value,
      Почта: document.getElementById('Почта-f').value,
      ГПД: document.getElementById('ГПД-f').value,
      Ставка: document.getElementById('Ставка-f').value
    }
    console.log(data)
    window.electronAPI.insertKafTable(data).then((answer) => {
      console.log(answer)
    });
    updateCurTable();
  }
});


const buttonOpenDeleteCard = document.getElementById("open-delete-card").addEventListener("click", () => {
  deleteCardText.innerHTML = `Вы точно хотите УДАЛИТЬ Преподавателя с ID = ${selectedID}?`;
  deleteCard.style.display = 'block';
});
const buttonCloseDeleteCard = document.getElementById("delete-card-close").addEventListener("click", () => {
  console.log('закрыто')
  deleteCard.style.display = 'none';
});
const secondButtonCloseDeleteCard = document.getElementById("delete-card-close-2").addEventListener("click", ()=>{
  console.log('закрыто')
  deleteCard.style.display = 'none';
});
const buttonDeleteAddCard = document.getElementById('confirm-delete-card').addEventListener("click", () => {
  
  data = {
    Personal_ID: selectedID
  }
  window.electronAPI.deleteKafTable(data).then((answer) => {
    console.log(answer)
  });
   deleteCard.style.display = 'none';
   updateCurTable();
});

function updateCurTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild); 
  };
  window.electronAPI.getDatabaseTable('Кафедра').then((data) => {
    createTableFromDatabase(data);
  });
}