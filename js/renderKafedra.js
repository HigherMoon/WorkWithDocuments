const addCard = document.getElementById("add-card");
const formAddCard = document.getElementById("new-teacher-form");
const deleteCard = document.getElementById("delete-card");
const deleteCardText = document.getElementById("text-delete-card");
let selectedID = null;

updateCurTables();

const buttonCloseAddCard = document.getElementById("add-card-close-kaf").addEventListener("click", () => {
  addCard.style.display = "none";
});

const buttonSaveAddCard = document.getElementById("save-add-card").addEventListener("click", () => {
  let errorNumber = 0;
  let errorText = "";
  let listOfReqCels = {
    "secondname-input": "Фамилию",
    "firstname-input": "Имя",
    "surname-input": "Отчество",
    "hours-input": "Нагрузку"
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
      secondname: document.getElementById("secondname-input").value,
      firstname: document.getElementById("firstname-input").value,
      surname: document.getElementById("surname-input").value,
      hours: document.getElementById("hours-input").value,
      position: document.getElementById("position-input").value,
      rank: document.getElementById("rank-input").value,
      academic: document.getElementById("academic-input").value,
      phone: document.getElementById("phone-input").value,
      mail: document.getElementById("mail-input").value,
      gpd: document.getElementById("gpd-input").value,
      salary: document.getElementById("salary-input").value
    }
    console.log(data)
    window.electronAPI.insertTeacher(data).then((answer) => {
      console.log(answer)
    });
    updateCurTables();
    addCard.style.display = "none";
  }
});

const buttonCloseDeleteCard = document.getElementById("delete-card-close").addEventListener("click", () => {
  deleteCard.style.display = "none";
});
const secondButtonCloseDeleteCard = document.getElementById("delete-card-close-2").addEventListener("click", ()=>{
  deleteCard.style.display = "none";
});


function updateCurTables() {
  window.electronAPI.getAllFromTable("kafedra").then((data) => {
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
      console.log(data);
      innerCell.addEventListener("click", () => {
        updateTablePersonalInfo(data[i])
      });
      innerCell.classList.add("inner-block");
      leftColumn.appendChild(innerCell);
    }
    let innerNewCell = document.createElement("div")
    innerNewCell.innerHTML = "+";
    innerNewCell.addEventListener("click", () => {
      addCard.style.display = "block";
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
    "academic": "Учёная степень",
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
    let infoBlock = document.createElement("div");
    let label = document.createElement("label");
    label.classList.add("infoLabel");
    label.textContent = dicts[key];

    let input = document.createElement("input");
    input.classList.add("inputInfo")
    input.id = key;
    input.type = "text";
    input.value = data[key];

    infoBlock.classList.add("infoBlock");
    infoBlock.appendChild(label);
    infoBlock.appendChild(input);
    rightColumn.appendChild(infoBlock);
  }

  let deleteButton = document.createElement("button");
  let deleteButtonIcon = document.createElement("img");
  deleteButtonIcon.src = "../img/icon-delete.svg";
  deleteButtonIcon.classList.add("icon-img");
  deleteButtonIcon.classList.add("float-right");
  deleteButtonIcon.addEventListener("click", () => {
    deleteData = { id: data["id"] };
    window.electronAPI.deleteTeacher(deleteData).then((answer) => {
      console.log(answer)
    });
    updateCurTables();
  });
  deleteButton.appendChild(deleteButtonIcon);
  rightColumn.appendChild(deleteButton);

  let saveButton = document.createElement("button");
  let saveButtonIcon = document.createElement("img");
  saveButtonIcon.src = "../img/icon-accept.svg";
  saveButtonIcon.classList.add("icon-img")
  saveButtonIcon.classList.add("float-right");
  saveButtonIcon.addEventListener("click", function() {
    idToUpdate = data["id"];
    updatePersonalInfo(idToUpdate);  
    updateCurTables();
  });
  saveButton.appendChild(saveButtonIcon)
  rightColumn.appendChild(saveButton);
}

function updatePersonalInfo(id) {
  dicts = {
    "firstname": "Имя",
    "secondname": "Фамилия",
    "surname": "Отчество",
    "academic": "Учёная степень",
    "position": "Должность",
    "rank": "Звание",
    "hours": "Нагрузка",
    "mail": "Почта",
    "phone": "Телефон",
    "gpd": "ГПД",
    "salary": "Ставка",
  }
  dataToUpdate = {
    "id" : id
  }
  for (key in dicts) {
    value = document.getElementById(key);
    dataToUpdate[key] = value.value;
  }
  window.electronAPI.updateTeacher(dataToUpdate).then((answer) => {
    console.log(answer)
  });
}

// Открытие и закрытие бокового меню
document.getElementById("menu-toggle").addEventListener("click", function() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
});