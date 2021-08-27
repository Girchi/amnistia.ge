// import nodeHtmlToImage from 'node-html-to-image'
import generateCardTemplateGe from "./cardtoimg-assets/generateFrontCardTemplate.js";
import generateCardTemplateEn from "./cardtoimg-assets/generateBackCardTemplate.js";
import nodeHtmlToImage from "node-html-to-image";

import * as fs from "fs";
import convertLetters from "../assets/js/convertLetters.js";
import generateQR from "../assets/js/generateQR.js";
import statusChanger from "../assets/js/statusChanger.js";

import dotenv from "dotenv"


(async () => {
  dotenv.config()

  const sortedUsers = getSortedUsers();

  for(const userData of sortedUsers){

    const currentCardNum = userData.card_number;
    const currentUserID = userData.user_id;

    const frontPath = `./generate/card-imgs/${currentCardNum}-front.jpg`;
    const backPath = `./generate/card-imgs/${currentCardNum}-back.jpg`;
    const QRValue = await generateQR(`https://amnistia.ge/user/${currentUserID}`);

    if (!fs.existsSync(frontPath)) {
      await nodeHtmlToImage({
        output: `./generate/card-imgs/${currentCardNum}-front.jpg`,
        html: generateCardTemplateGe(),
        content: {
          name: userData.name,
          img: userData.img,
          registration: userData.registration,
          card_number: userData.card_number,
          id_number: userData.id_number,
          birth_date: userData.birth_date,
          
          status: statusChanger(userData.status, 'clean'),
          class: statusChanger(userData.status, 'class'),
        },
      }).then(() => console.log(`${currentCardNum} frontcard created successfully!'`));
    }
    if (!fs.existsSync(backPath)) {
      await nodeHtmlToImage({
        output: `./generate/card-imgs/${currentCardNum}-back.jpg`,
        html: generateCardTemplateEn(),
        content: {
          card_number: userData.card_number,
          id_number: userData.id_number,
          birth_date: userData.birth_date,
          registration: userData.registration,

          name: convertLetters(userData.name),
          status: statusChanger(userData.status, 'lang'),
          class: statusChanger(userData.status, 'class'),
          QRValue,
        },
      }).then(() => console.log(`${currentCardNum} backcard created successfully!'`));
    }
    console.log(`User Number ${currentCardNum} Done...`); 
  }
})();

function getSortedUsers() {
  let allUser = []
  const usersJSONList = fs.readdirSync("./database")

  for(const userJSONName of usersJSONList){
    const userJSON = JSON.parse(fs.readFileSync(`./database/${userJSONName}`, 'utf8'));
    userJSON.status = statusChanger(userJSON.status, 'clean')
    allUser.push(userJSON)
  }

  allUser.sort((a, b) => a.card_number - b.card_number)
  return allUser
}