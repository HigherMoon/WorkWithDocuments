const containerTable = document.getElementById("container-table");
const addCard = document.getElementById("add-card-disciplines");

getDataAndCreateTable()

const listHeadValuesPersonalTable = {
  "ID": "id",
  "Название": "name",
}

function getDataAndCreateTable() {
  window.electronAPI.getCurDisciplines().then((data) => {
    createTableOfDisciplines(data);
  });
};



const buttonSaveAddCard = document.getElementById('save-add-card').addEventListener("click", () => {
  let errorNumber = 0;
  let errorText = "";
  let listOfReqCels = {
    "Наименование-f": "Наименование"
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
      name: document.getElementById('Наименование-f').value
    }
    console.log(data)
    window.electronAPI.insertDisciplineTable(data).then((answer) => {
      console.log(answer)
    });
    getDataAndCreateTable();
    addCard.style.display = 'none';
  }
});



const buttonOpenAddCardFlows = document.getElementById("open-add-card").addEventListener("click", () => {
  addCard.style.display = 'block';
});
const buttonCloseAddCardFlows = document.getElementById("add-card-close-disciplines").addEventListener("click", () => {
  console.log('закрыто')
  addCard.style.display = 'none';
});


























function createTableOfDisciplines(data) {
  if (Object.keys(data).length == 0) {
    console.log("Пустая бд")
    return false;
  };
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild); 
  }
  let table = document.createElement("table");
  let headTable = document.createElement("thead");
  table.id = "scroll-table-body";
  headTable.id = "head-table";

  for (let paramOfCurPartData in listHeadValuesPersonalTable) {
    let headRow = document.createElement("th");
    headRow.innerHTML = paramOfCurPartData;
    headRow.id = paramOfCurPartData;
    headTable.appendChild(headRow);
  }
  finalCell = document.createElement("th")
  finalCell.style.width = "100px"
  headTable.appendChild(finalCell);
  table.appendChild(headTable);
  
  for (let indexOfData in Object.keys(data)) {
    let row = document.createElement("tr");
    let curPartData = data[indexOfData];
    for (let headRowsValue in listHeadValuesPersonalTable) {
      let col = document.createElement("td");
      col.innerHTML = curPartData[listHeadValuesPersonalTable[headRowsValue]];
      col.id = headRowsValue;
      row.appendChild(col);
    };
    let col = document.createElement("td");
    let deleteButton = document.createElement('button');
    let deleteButtonIcon = document.createElement('img');
    deleteButtonIcon.src = "../img/icon-delete.svg";
    deleteButtonIcon.classList.add("icon-img");
    deleteButtonIcon.addEventListener("click", () => {
      deleteData = { id: curPartData['id'] };
      window.electronAPI.deleteDisciplineTable(deleteData).then((answer) => {
        console.log(answer)
      });
      updateCurTable();
    });
    deleteButton.appendChild(deleteButtonIcon);
    col.appendChild(deleteButton);

    let editButton = document.createElement('button');
    let editButtonIcon = document.createElement('img');
    editButtonIcon.src = "../img/icon-pencil.png";
    editButtonIcon.classList.add("icon-img");
    editButton.appendChild(editButtonIcon);
    col.appendChild(editButton);
    row.appendChild(col);

    table.appendChild(row);
  };
  containerTable.appendChild(table);
  console.log("Таблица с преподавателями создана.")
};


function updateCurTable() {
  while(containerTable.firstChild) {
    containerTable.removeChild(containerTable.firstChild); 
  };
  window.electronAPI.getCurDisciplines().then((data) => {
    createTableOfDisciplines(data);
  });
}


document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});