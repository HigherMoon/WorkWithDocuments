



/*
* subButton - кнопка "отправить" на странице
* событие 'click' запускает функцию:
* --- inputElement - принимает со страницы файл, который был указан в inputArea
* --- data - отправляет в main.js путь и получает назад promise
* --- data.then((value) ...) - после получения promise срабатывает .then, где полученные данные
* ------ из промиса помещаются в переменную value
* ------ index - номер в списке value
* ------ aboutPerson - получает список данных о человеке из value[index]
* ------ field - поле или ключ для доступа к данным(как (key:value))
* ------ aboutPerson[field] - какая-то определённая информация о человеке
*/
const subButton = document.getElementById("sub-button").addEventListener("click", () => {
    const inputElement = document.getElementById("input-button").files[0];
    let data =  window.electronAPI.sendPathToMain(inputElement["path"]);
    
    data.then((value) => {
      for (let index in value){
        const aboutPerson = value[index];
        for (let field in aboutPerson) {
          console.log(index + ' '+ field + ' : ' + aboutPerson[field]);
        }
      }
    });

  });
