const containerTable = document.getElementById("container-table")
/*
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
*/
const addCard = document.getElementById("add-card");
const formAddCard = document.getElementById('new-up-form');
const deleteCard = document.getElementById('delete-card');
const deleteCardText = document.getElementById('text-delete-card');
const datalistFlows = document.getElementById("flows-input-helper");
const datalistDisciplines = document.getElementById("disciplines-input-helper");
const selectTypes = document.getElementById("Тип-f")
const inputGroup = document.getElementById("flows-input");
let selectedID = null;

listOfValues = {
  "Семестр": "semester",
  "Поток": "flow",
  "Дисциплина": "discipline",
  "Тип": "type",
  "Подгруппы": "subgroups",
  "Часов на подгруппу": "sub_hours",
  "Всего часов": "hours",
};

window.electronAPI.getCurSyllabusTable([]).then((data) => {
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
  window.electronAPI.getCurFlows(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.value = objData["id"];
      newOption.innerHTML = `${objData['name']} | ${objData['year']} | ${objData['education_form']}`;
      datalistFlows.appendChild(newOption);
    }
  });
  window.electronAPI.getCurDisciplines(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.value = objData["id"];
      newOption.innerHTML = `${objData['name']}`;
      datalistDisciplines.appendChild(newOption);
    }
  });
  window.electronAPI.getCurTypes(dataTo).then((data) => {
    for (let index in data) {
      let objData = data[index];
      let newOption = document.createElement("option");
      newOption.value = objData["id"];
      newOption.innerHTML = `${objData['name']}`;
      selectTypes.appendChild(newOption);
    }
  })
  addCard.style.display = 'block';
});

const buttonCloseAddCard = document.getElementById("add-card-close-up").addEventListener("click", () => {
  console.log('закрыто');
  addCard.style.display = 'none';
  document.getElementById('flows-input').value = "";
  document.getElementById('Наименование-f').value = null;
  document.getElementById('Семестр-f').value = null;
  document.getElementById('Тип-f').value = null;
  document.getElementById('Часы_УП-f').value = null;
  document.getElementById('Часы-f').value = null;
});


const buttonSaveAddCard = document.getElementById('save-add-card').addEventListener("click", () => {
  var sub_hours = document.getElementById('Часы_УП-f').value;
  var hours = document.getElementById('Часы-f').value;
  console.log(sub_hours, hours ) 
  data = {
    flow_ID: document.getElementById('flows-input').value,
    discipline_id: document.getElementById('Наименование-f').value,
    semester: document.getElementById('Семестр-f').value,
    type: document.getElementById('Тип-f').value,
    subgroups: document.getElementById('Часы-f').value / document.getElementById('Часы_УП-f').value,
    sub_hours: document.getElementById('Часы_УП-f').value,
    hours: document.getElementById('Часы-f').value
  }
  if (data.flow_ID=="" || data.discipline_id=="" ||
      data.type=="" || data.subgroups=="" ||
      data.sub_hours=="" || data.hours=="")
  {
    alert('Заполнить надо всё!')
    console.log('Не всё')
  }
  else if (data.sub_hours<=0 || data.hours<=0) {
    alert('Часы не могут быть меньше или равны 0')
  }
  else {
    console.log(data)
    window.electronAPI.insertUPTable(data).then((answer) => {
      console.log(answer)
    });
    window.electronAPI.getCurSyllabusTable('syllabus').then((data) => {
      createTableFromDatabase(data);
    });
    addCard.style.display = 'none';
    document.getElementById('flows-input').value = null;
    document.getElementById('Наименование-f').value = null;
    document.getElementById('Семестр-f').value = null;
    document.getElementById('Тип-f').value = null;
    document.getElementById('Часы_УП-f').value = null;
    document.getElementById('Часы-f').value = null;
  }
});
/*
const buttonOpenDeleteCard = document.getElementById("open-delete-card").addEventListener("click", () => {
  deleteCardText.innerHTML = `Вы точно хотите УДАЛИТЬ предмет с ID = ${selectedID}?`;
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
  window.electronAPI.getCurSyllabusTable([]).then((data) => {
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
      let curPartData = database[indexOfData];
  
      for (let paramOfCurPartData in listOfValues) {
        let col = document.createElement("td");
        col.innerHTML = curPartData[listOfValues[paramOfCurPartData]];
        col.id = listOfValues[paramOfCurPartData];
        row.appendChild(col);
      };
      let col = document.createElement("td");
      let deleteButton = document.createElement('button');
      let deleteButtonIcon = document.createElement('img');
      deleteButtonIcon.src = "../img/icon-delete.svg";
      deleteButtonIcon.classList.add("icon-img");
      deleteButton.addEventListener("click", () => {
        deleteData = { id: curPartData['id'] };
        window.electronAPI.deleteUPTable(deleteData).then((answer) => {
          console.log(answer);
        });
        updateCurTable();
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
  
    // Добавление таблицы на страницу
    containerTable.appendChild(table);
    console.log("Новая таблица создана.")
  };

document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});