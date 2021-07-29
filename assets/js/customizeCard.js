import convertLetters from "./convertLetters.js";

const cardForm = document.getElementById("card-form");
const cards = document.getElementById("cards");
const cardFullName = document.querySelectorAll("#cardFullName");
const cardIdNum = document.querySelectorAll("#cardIdNum");
const cardNum = document.querySelectorAll("#cardNum");

const cardDate = document.querySelectorAll("#cardDate");
const cardStatus = document.querySelectorAll("#cardStatus");
const cardValid = document.querySelectorAll("#cardValid");
const cardBadge = document.querySelectorAll("#cardBadge");

function changeInputData() {
  const nameValue = document.getElementById("nameInput").value;
  const idNumValue = document.getElementById("idNumInput").value;
  const cardNumValue = document.getElementById("cardNumInput").value;

  if (nameValue) {
    let convertedName = nameValue
      .split(" ")
      .map((word) => convertLetters(word))
      .join(" ");
    cardFullName[0].textContent = nameValue;
    cardFullName[1].textContent = convertedName;
  }

  for (let i = 0; i < 2; i++) {
    if (idNumValue) cardIdNum[i].textContent = idNumValue;
    if (cardNumValue) cardNum[i].textContent = cardNumValue;
  }
}

async function changeSelectData() {
  const dateValue = document
    .getElementById("dateInput")
    .value.replace(/[-]/gi, "/");
  const statusValue = document.getElementById("statusInput").value;
  const validValue = document
    .getElementById("validInput")
    .value.replace(/[-]/gi, "/");

  const response = await fetch(`assets/js/statuses.json`);
  const statuses = await response.json();

  const statusClass = statuses[statusValue].replace(" ", "");
  const status = statusValue.replace("_", " ");
  const statusEN = statuses[statusValue];

  if (statusValue) {
    cards.classList.remove(cards.classList[1]);
    cards.classList.add(`card-${statusClass}`);

    cardStatus[0].textContent = status;
    cardStatus[1].textContent = statusEN;
  }

  for (let i = 0; i < 2; i++) {
    if (dateValue) cardDate[i].textContent = dateValue;
    cardBadge[i].src = `/assets/img/card/${statusClass}.png`;
    if (validValue) cardValid[i].textContent = validValue;
  }
}

cardForm.addEventListener("keyup", changeInputData);
cardForm.addEventListener("change", changeSelectData);
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

const imageInput = document.getElementById("imageInput");
const cardImage = document.querySelector("#cardImage");

imageInput.addEventListener("change", function () {
  cardImage.src = URL.createObjectURL(this.files[0]);
});
