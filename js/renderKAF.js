const addCard = document.getElementById('add-card');
const formAddCard = document.getElementById('new-teacher-form');
const deleteCard = document.getElementById('delete-card');
const deleteCardText = document.getElementById('text-delete-card');
let selectedID = null;

updateCurTables();

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
    updateCurTables();
    addCard.style.display = 'none';
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


function updateCurTables() {
  window.electronAPI.getDatabaseTable('kafedra').then((data) => {
    let rightColumn = document.getElementById("right");
    while(rightColumn.firstChild) {
      rightColumn.removeChild(rightColumn.firstChild); 
    };

    let leftColumn = document.getElementById("left");
    while(leftColumn.firstChild) {
      leftColumn.removeChild(leftColumn.firstChild); 
    };

    for (let i in data) {
      let innerCell = document.createElement("div")
      innerCell.innerHTML = `${data[i]["secondname"]} ${data[i]["firstname"][0]}. ${data[i]["surname"][0]}.`;
      innerCell.addEventListener("click", () => {
        updateTablePersonalInfo(data[i])
      });
      innerCell.classList.add("inner-block");
      leftColumn.appendChild(innerCell);
    }
    let innerNewCell = document.createElement("div")
    innerNewCell.innerHTML = '+';
    innerNewCell.addEventListener("click", () => {
      addCard.style.display = 'block';
    });
    innerNewCell.classList.add("inner-block");
    leftColumn.appendChild(innerNewCell)
  });
}


function updateTablePersonalInfo(data) {
  dicts = {
    "firstname": "Имя",
    "secondname": "Фамилия",
    "surname": "Отчество",
    "academic": "Учёная стипендия",
    "position": "Должность",
    "rank": "Звание",
    "hours": "Нагрузка",
    "mail": "Почта",
    "phone": "Телефон",
    "gpd": "ГПД",
    "salary": "Ставка",
  }
  let rightColumn = document.getElementById("right");
  
  while(rightColumn.firstChild) {
    rightColumn.removeChild(rightColumn.firstChild); 
  };

  for (key in dicts) {
    let infoBlock = document.createElement('div');
    let label = document.createElement('label');
    label.classList.add("infoLabel");
    label.textContent = dicts[key];

    let input = document.createElement('input');
    input.classList.add("inputInfo")
    input.type = "text";
    input.value = data[key];

    infoBlock.classList.add("infoBlock");
    infoBlock.appendChild(label);
    infoBlock.appendChild(input);
    rightColumn.appendChild(infoBlock);
  }

  deleteButton = document.createElement('button');
  deleteButton.classList.add("deleteButton");
  deleteButton.innerHTML = 'Удалить';
  deleteButton.addEventListener("click", () => {
    deleteData = { id: data['id'] };
    window.electronAPI.deleteKafTable(deleteData).then((answer) => {
      console.log(answer)
    });
    updateCurTables();
  });
  rightColumn.appendChild(deleteButton);

  saveButton = document.createElement('button');
  saveButton.classList.add("saveButton");
  saveButton.innerHTML = 'Сохранить';
  rightColumn.appendChild(saveButton);
}

// Открытие и закрытие бокового меню
document.getElementById('menu-toggle').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
});