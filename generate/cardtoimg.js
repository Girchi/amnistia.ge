// import nodeHtmlToImage from 'node-html-to-image'
import generateCardTemplateGe from "./cardtoimg-assets/generateFrontCardTemplate.js";
import generateCardTemplateEn from "./cardtoimg-assets/generateBackCardTemplate.js";
import nodeHtmlToImage from "node-html-to-image";
import * as fs from "fs";

import convertLetters from "../assets/js/convertLetters.js";
import generateQR from "../assets/js/generateQR.js";
import statusChanger from "../assets/js/statusChanger.js";

async function cardtoimg (body){

  const cardNum = body.card_number;
  const QRValue = await generateQR(`https://amnistia.ge/user/${body.user_id}`);
  const profileImg = convertImage(body.img)
  const badgeIcon = convertImage(`/assets/img/card/${statusChanger(body.status, 'class')}.png`)
  const assetImg = convertImage('/assets/img/card/amnistia.png')

  await nodeHtmlToImage({
    output: `./generate/card-imgs/${cardNum}-front.jpg`,
    html: generateCardTemplateGe(),
    content: {
      name: body.name,
      registration: body.registration,
      card_number: body.card_number,
      id_number: body.id_number,
      birth_date: body.birth_date,
      status: statusChanger(body.status, 'clean'),

      profileImg,
      badgeIcon,
      assetImg
    },
  }).then(() => console.log(`${cardNum} frontcard created successfully!'`));
    
  await nodeHtmlToImage({
    output: `./generate/card-imgs/${cardNum}-back.jpg`,
    html: generateCardTemplateEn(),
    content: {
      card_number: body.card_number,
      id_number: body.id_number,
      birth_date: body.birth_date,
      registration: body.registration,
      name: convertLetters(body.name),
      status: statusChanger(body.status, 'lang'),

      badgeIcon,
      assetImg,
      QRValue,
    },
  }).then(() => console.log(`${cardNum} backcard created successfully!'`));

  console.log(`User Number ${cardNum} Done...`); 
};

function convertImage(img) {
  const cleanUrl = img.replace('/', './')
  const image = fs.readFileSync(cleanUrl);
  const base64Image = new Buffer.from(image).toString('base64');
  const dataURI = 'data:image/jpeg;base64,' + base64Image
  return dataURI
}

export default cardtoimg;