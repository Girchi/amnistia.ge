import convertLetters from "/assets/js/convertLetters.js";
import statusChanger from "/assets/js/statusChanger.js";

// Input assets for other statuses
$(document).ready(function(){
  let multipleCancelButton = new Choices('#multipleStatusInput', {
  removeItemButton: true,
  maxItemCount:7,
  searchResultLimit:8,
  renderChoiceLimit:8
  });
});

const cardFullName = document.querySelectorAll('#cardFullName');
const cardIdNum = document.querySelectorAll('#cardIdNum');
const cardDate = document.querySelectorAll('#cardDate');
const cardStatus = document.querySelectorAll('#cardStatus');
const cardBadge = document.querySelectorAll('#cardBadge');

// Data changes on type
function changeInputData() {
  const nameValue = nameInput.value;
  const idNumValue = idNumInput.value;

  if (nameValue) {
    cardFullName[0].textContent = convertLetters(nameValue, 'geo');
    cardFullName[1].textContent = convertLetters(nameValue);
  }

  if (idNumValue) {
    cardIdNum.forEach(IdNum => {  
      IdNum.textContent = idNumValue;
    })
  }
}

// Data changes on select
function changeSelectData() {
  const dateValue = dateInput.value;
  const statusValue = statusInput.value;

  const statusClass = statusChanger(statusValue, 'class');
  const status = statusChanger(statusValue, 'clean');;
  const statusLang = statusChanger(statusValue, 'lang');

  if (statusValue) { 
    cardStatus[0].textContent = status;
    cardStatus[1].textContent = statusLang;

    cardBadge.forEach(badge => {  
      badge.src = `/assets/img/card/${statusClass}.png`;
    })
  }
  
  if (dateValue) {
    cardDate.forEach(date => {  
      date.textContent = dateValue;
    })
  }
}

cardForm.addEventListener("keyup", changeInputData);
cardForm.addEventListener("change", changeSelectData);

// Import image on browser
imageInput.addEventListener("change", function () {
  cardImg.src = URL.createObjectURL(this.files[0]);
})

export { changeInputData, changeSelectData };
