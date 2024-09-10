const containerTable = document.getElementById("container-table-up")
const saveButtonTableUP = document.getElementById("save-current-table-up").addEventListener("click", () => {
  let table = document.getElementById(`data-table`);
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
    window.electronAPI.updateUPTable(dataToSend).then((answer) => {
      console.log(answer)
    });
  } 
});
const addCard = document.getElementById("add-card");
const formAddCard = document.getElementById('new-up-form');
const deleteCard = document.getElementById('delete-card');
const deleteCardText = document.getElementById('text-delete-card');
let selectedID = null;
const datalistGroups = document.getElementById("flows-input-helper");
const inputGroup = document.getElementById("flows-input")


window.electronAPI.getDatabaseTable('Учебный_план').then((data) => {
  createTableFromDatabase(data);
});


const buttonOpenAddCard = document.getElementById("open-add-card").addEventListener("click", () => {
  while(datalistGroups.firstChild) {
    datalistGroups.removeChild(datalistGroups.firstChild); 
  };
  dataTo={};
  window.electronAPI.getCurFlows(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.value = objData["Flow_ID"];
      newOption.innerHTML = `${objData['Наименование']} | ${objData['Год']} | ${objData['Форма_обучения']}`;
      datalistGroups.appendChild(newOption);
    }
  });
  addCard.style.display = 'block';
});
const buttonCloseAddCard = document.getElementById("add-card-close").addEventListener("click", () => {
  console.log('закрыто');
  addCard.style.display = 'none';
  document.getElementById('flows-input').value = "";
    document.getElementById('Наименование-f').value = null;
    document.getElementById('Семестр-f').value = null;
    document.getElementById('Тип-f').value = null;
    document.getElementById('Количество_подгрупп-f').value = null;
    document.getElementById('Часы_УП-f').value = null;
    document.getElementById('Часы-f').value = null;
});
const secondButtonCloseAddCard = document.getElementById("close-add-card").addEventListener("click", ()=>{
  console.log('закрыто');
  addCard.style.display = 'none';
  document.getElementById('flows-input').value = null;
    document.getElementById('Наименование-f').value = null;
    document.getElementById('Семестр-f').value = null;
    document.getElementById('Тип-f').value = null;
    document.getElementById('Количество_подгрупп-f').value = null;
    document.getElementById('Часы_УП-f').value = null;
    document.getElementById('Часы-f').value = null;
});
const buttonSaveAddCard = document.getElementById('save-add-card').addEventListener("click", () => {
  data = {
    Flow_ID: document.getElementById('flows-input').value,
    Наименование: document.getElementById('Наименование-f').value,
    Семестр: document.getElementById('Семестр-f').value,
    Тип: document.getElementById('Тип-f').value,
    Количество_подгрупп: document.getElementById('Количество_подгрупп-f').value,
    Часы_УП: document.getElementById('Часы_УП-f').value,
    Часы: document.getElementById('Часы-f').value
  }
  if (data.Flow_ID=="" || data.Дисциплина=="" ||
      data.Тип=="" || data.Количество_подгрупп=="" ||
      data.Часы_УП=="" || data.Часы=="")
  {
    alert('Заполнить надо всё!')
    console.log('Не всё')
  }
  else if (data.Часы_УП<=0 || data.Часы<=0) {
    alert('Часы не могут быть меньше или равны 0')
  }
  else {
    console.log(data)
    window.electronAPI.insertUPTable(data).then((answer) => {
      console.log(answer)
    });
    window.electronAPI.getDatabaseTable('Учебный_план').then((data) => {
      createTableFromDatabase(data);
    });
    addCard.style.display = 'none';
    document.getElementById('Flow_ID-f').value = null;
    document.getElementById('Наименование-f').value = null;
    document.getElementById('Семестр-f').value = null;
    document.getElementById('Тип-f').value = null;
    document.getElementById('Количество_подгрупп-f').value = null;
    document.getElementById('Часы_УП-f').value = null;
    document.getElementById('Часы-f').value = null;
  }
});

const buttonOpenDeleteCard = document.getElementById("open-delete-card").addEventListener("click", () => {
  deleteCardText.innerHTML = `Вы точно хотите УДАЛИТЬ предмет с ID = ${selectedID}?`;
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
    UP_ID: selectedID
  }
  window.electronAPI.deleteUPTable(data).then((answer) => {
    console.log(answer)
  });
   deleteCard.style.display = 'none';
   updateCurTable();
});

function updateCurTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild); 
  };
  window.electronAPI.getDatabaseTable('Учебный_план').then((data) => {
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
        if (paramOfCurPartData != "UP_ID") col.contentEditable = true;
        col.innerHTML = curPartData[paramOfCurPartData];
        col.id = paramOfCurPartData;
        row.appendChild(col);
      };
      row.addEventListener("click", () => {
        selectedID = row.children["UP_ID"].innerHTML;
      });
      table.appendChild(row);
    };
  
     // Добавление таблицы на страницу
     containerTable.appendChild(table);
    console.log("Новая таблица создана.")
  };