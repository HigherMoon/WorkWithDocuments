const containerTable = document.getElementById("container-table");

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
    table.appendChild(row);
  };
  containerTable.appendChild(table);
  console.log("Таблица с преподавателями создана.")
};



document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});