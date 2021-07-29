// import nodeHtmlToImage from 'node-html-to-image'
import generateCardTemplateGe from "./cardtoimg-assets/generateFrontCardTemplate.js";
import generateCardTemplateEn from "./cardtoimg-assets/generateBackCardTemplate.js";
import nodeHtmlToImage from "node-html-to-image";

import fetch from "node-fetch";
import * as fs from "fs";
import convertLetters from "../assets/js/convertLetters.js";
import generateQR from "../assets/js/generateQR.js";

const hostname = "http://127.0.0.1:3000";

(async () => {
  const response = await fetch(`${hostname}/assets/js/users.json`);
  const usersJSON = await response.json();
  const users = usersJSON.data;

  const statusResponse = await fetch(`${hostname}/assets/js/statuses.json`);
  const statuses = await statusResponse.json();

  for (let i = 0; i < users.length; i++) {
    const frontPath = `./generate/card-imgs/${users[i].card_number}-front.jpg`;
    const backPath = `./generate/card-imgs/${users[i].card_number}-back.jpg`;
    const QRValue = await generateQR(`${hostname}/user/${i}`);

    if (!fs.existsSync(frontPath)) {
      nodeHtmlToImage({
        output: `./generate/card-imgs/${users[i].card_number}-front.jpg`,
        html: generateCardTemplateGe(),
        content: {
          name: users[i].name,
          surname: users[i].surname,
          card_number: users[i].card_number,
          id_number: users[i].id_number,
          birth_date: users[i].birth_date,
          img: users[i].img,
          validation: users[i].validation,
          status: users[i].status,
          class: statuses[users[i].status.replace(" ", "_")].replace(" ", ""),
        },
      }).then(() => console.log(`${i} frontcard created successfully!'`));
    }
    if (!fs.existsSync(backPath)) {
      nodeHtmlToImage({
        output: `./generate/card-imgs/${users[i].card_number}-back.jpg`,
        html: generateCardTemplateEn(),
        content: {
          card_number: users[i].card_number,
          id_number: users[i].id_number,
          birth_date: users[i].birth_date,
          validation: users[i].validation,
          class: statuses[users[i].status.replace(" ", "_")].replace(" ", ""),

          nameEN: convertLetters(users[i].name),
          surnameEN: convertLetters(users[i].surname),
          statusEN: statuses[users[i].status.replace(" ", "_")],
          QRValue: QRValue,
        },
      }).then(() => console.log(`${i} backcard created successfully!'`));
    }
  }
  console.log("Works...");
})();
