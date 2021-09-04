import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as fs from "fs";
import bodyParser from "body-parser";
import multer from "multer";
import fetch from "node-fetch";
import https from "https";
import FormData from 'form-data';
import dotenv from "dotenv";
dotenv.config();

import convertLetters from "./assets/js/convertLetters.js";
import statusChanger from "./assets/js/statusChanger.js";
import cardtoimg from "./generate/cardtoimg.js";
import generatepdf from "./generate/generatepdf.js";

const app = express();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/img/users-images");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorageEngine });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set("view engine", "pug");

app.use("/assets", express.static("assets"));
app.use("/generate", express.static("generate"));

const options = {
  key: fs.readFileSync('https-conf/key.pem'),
  cert: fs.readFileSync('https-conf/cert.pem')
};

https.createServer(options, app).listen(8000);
console.log(`https://localhost:8000`)
// app.listen(3000)

// Home Page
app.get("/", (req, res) => {

  const usersJSONList = fs.readdirSync("./database")

  let tokenExpired = '';
  if(req.query.param1 != undefined){
    tokenExpired = req.query.param1;
  }

  const usersList = usersJSONList
  .map(userJSON => {
    userJSON = JSON.parse(fs.readFileSync(`./database/${userJSON}`, 'utf8'))
    userJSON.status = statusChanger(userJSON.status, 'clean')
    return userJSON
  })
  .sort((a, b) => b.card_number - a.card_number)
  .slice(0,6)

  res.render(__dirname + "/snippet/index", { usersList, tokenExpired });

});


// All Users page
app.get("/users", (req, res) => {

  const usersJSONList = fs.readdirSync("./database")

  const usersList = usersJSONList
  .map(userJSON => JSON.parse(fs.readFileSync(`./database/${userJSON}`, 'utf8')))
  .sort((a, b) => b.card_number - a.card_number)

  res.render(__dirname + "/snippet/users", { usersList });
});


// User inner page
app.get("/user/:id", (req, res) => {
  try {
    const userData = JSON.parse(fs.readFileSync(`./database/${req.params.id}.json`, 'utf8'));

    const userDataConverted = {
      convertedName: convertLetters(userData.name),
      convertedStatus: statusChanger(userData.status, 'lang'),
      convertedClasses: [statusChanger(userData.status, 'class'), ...userData.other_statuses.map(status => statusChanger(status, 'class'))],
      cleanStatuses: [statusChanger(userData.status, 'clean'), ...userData.other_statuses.map(status => statusChanger(status, 'clean'))]
    };
    res.render(__dirname + "/snippet/profile", { userDataConverted, userData });
  } catch (error) {
    res.redirect(`/custom-card`);
  }
});


// User data import Page
app.get("/custom-card", (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 10)
  res.render(__dirname + "/snippet/custom-card", { newCardNum: freeCardNum(), currentDate });
});


// User verify and save data
app.post( "/custom-card", [urlencodedParser, upload.single("image")], (req, res) => {

  const reqBody = req.body;
  const token = reqBody.token;

  fetch(`${process.env.GIRCHI_DOMAIN}/jsonapi`, { cache: 'no-cache', headers: { 'Authorization': token } })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401){
      console.log('Unauthorized User')
      res.redirect('/?param1=expired')
    }
  })
  .then(loginData => {

    if(loginData.meta !== undefined){

      const userID = loginData.meta.links.me.meta.id
      const userExists = fs.existsSync(`./database/${userID}.json`)

      // Define user permission here
      const userAllowed = userID !== '';

      reqBody.other_statuses == null ? reqBody.other_statuses = [] : 
      typeof reqBody.other_statuses !== "object" ? reqBody.other_statuses = [reqBody.other_statuses] : true;

      reqBody.token = ''
      reqBody.img = '/' + req.file.path;
      reqBody.name = convertLetters(reqBody.name, 'geo')
      reqBody.card_number = freeCardNum()
      reqBody.registration = new Date().toISOString().slice(0, 10)
      reqBody.user_id = userID
      const stringedData = JSON.stringify(reqBody)

      if(!userExists && userAllowed){
        
        fs.writeFileSync(`./database/${userID}.json`, stringedData, err => { if(err) console.log(err) })

        res.redirect(`/user/${userID}`);

        cardtoimg(reqBody)

      } else if(userExists && userAllowed){

        const userOldJSON = JSON.parse(fs.readFileSync(`./database/${userID}.json`, 'utf8'));
        reqBody.card_number = userOldJSON.card_number;
        const stringedData = JSON.stringify(reqBody)

        fs.writeFileSync(`./database/${userID}.json`, stringedData, err => { if(err) console.log(err) })

        res.redirect(`/user/${userID}`);

        cardtoimg(reqBody)
        
      } else {
        res.redirect(`/`);
      }

    } else {
      console.log('Unauthorized User')
      res.redirect('/?param1=expired')
    }
  })

});


// User Authorization
app.post("/authorization/:accessToken&:expirationTime&:userID", (req, res) => {

// Grant User By Token
  const formData = new FormData()
  formData.append("grant_type", "facebook_login_grant");
  formData.append("client_id", process.env.CLIENT_ID);
  formData.append("client_secret", process.env.SECRET_KEY);
  formData.append("facebook_access_token", req.params.accessToken);
  formData.append("facebook_user_id", req.params.userID);
  formData.append("facebook_token_expires_in", req.params.expirationTime);


  fetch(`${process.env.GIRCHI_DOMAIN}/oauth/token`, { method: 'POST', body: formData })
  .then((response) => {
    if (response.status === 200) {
    return response.json();
    } else if (response.status === 401){
      res.status(401).json({ error: 'Unauthorized' });
    }
  })
  .then((tokenGrant) => {
    if(tokenGrant != undefined){
    const token = `Bearer ${tokenGrant.access_token}`


    // Get User Information
    fetch(`${process.env.GIRCHI_DOMAIN}/jsonapi`, { cache: 'no-cache', headers: { 'Authorization': token } })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401){
            console.log('Unauthorized User')
        }
    })
    .then(userInfo => {
      if(userInfo != undefined){
      const userID = userInfo.meta.links.me.meta.id
      const userPath = userInfo.meta.links.me.href

      fetch(userPath, { cache: 'no-cache', headers: { 'Authorization': token } })
      .then(response => response.json())
      .then(userData => {
    
        const userLoginName = userData.data.attributes.name
        const userFirstName = userData.data.attributes.field_first_name
        const userLastName = userData.data.attributes.field_last_name
        const userImgLocation = userData.data.relationships.user_picture.links.related.href

        fetch(userImgLocation, { cache: 'no-cache', headers: { 'Authorization': token } })
        .then(response => response.json())
        .then(userImgData => {
          let userImgPath = userImgData.data ?
            `${process.env.GIRCHI_DOMAIN}${userImgData.data.attributes.uri.url}` :
            `/assets/img/avatar.png`;

          const localStore = { token, userID, userImgPath, userFirstName, userLastName, userLoginName }

          res.send({localStore})    
        })
      })
      }
    })
    }
  })
});


// Countitution Page
app.get("/constitution", (req, res) => {
  res.render(__dirname + "/snippet/constitution");
});


// Download PDFs Page
app.get("/cards-download", (req, res) => {
  (async function generation () {

    await generatepdf()

    let PDFDirectory = fs.readdirSync("generate/pdf");
    res.render(__dirname + "/snippet/card-download", { PDFDirectory });
    
    })()
});


// Defines free card number
function freeCardNum(reserved) {
  const usersJSONList = fs.readdirSync("./database")

  const usersList = usersJSONList
  .map(userJSON => JSON.parse(fs.readFileSync(`./database/${userJSON}`, 'utf8')))
  .sort((a, b) => b.card_number - a.card_number)

  const reservedUsers = usersList.filter(user => Number(user.card_number) <= 1000)
  const otherUsers = usersList.filter(user => Number(user.card_number) > 1000)

  if(reserved && reservedUsers[0] && Number(reservedUsers[0].card_number) < 1000) {
    const newCardNum = JSON.stringify(Number(reservedUsers[0].card_number) + 1);
    return newCardNum.padStart(4, '0');
  } else if (reserved && reservedUsers[0] === undefined) {
    return '0001'
  } else if (otherUsers[0] !== undefined) {
    const newCardNum = JSON.stringify(Number(otherUsers[0].card_number) + 1);
    return newCardNum.padStart(4, '0');
  } else {
    return '1001'
  }

}