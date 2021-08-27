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

const userName = document.querySelectorAll('#userName');
const userIdNum = document.querySelectorAll('#userIdNum');
const userDate = document.querySelectorAll('#userDate');
const userStatus = document.querySelectorAll('#userStatus');
const userBadge = document.querySelectorAll('#userBadge');

// Data changes on type
function changeInputData() {
  const nameValue = nameInput.value;
  const idNumValue = idNumInput.value;

  if (nameValue) {
    userName[0].textContent = convertLetters(nameValue, 'geo');
    userName[1].textContent = convertLetters(nameValue);
  }

  if (idNumValue) {
    userIdNum.forEach(IdNum => {  
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
    userStatus[0].textContent = status;
    userStatus[1].textContent = statusLang;

    userBadge.forEach(badge => {  
      badge.src = `/assets/img/card/${statusClass}.png`;
    })
  }
  
  if (dateValue) {
    userDate.forEach(userDate => {  
      userDate.textContent = dateValue;
    })
  }
}

cardForm.addEventListener("keyup", changeInputData);
cardForm.addEventListener("change", changeSelectData);

// Import image on browser
imageInput.addEventListener("change", function () {
  cardImg.src = URL.createObjectURL(this.files[0]);
})