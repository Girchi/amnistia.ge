import express, { response } from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import * as fs from 'fs';
import QRCode from "qrcode";

const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.set("view engine", "pug");
app.use("/assets", express.static('assets'));
app.use("/generate", express.static("generate"));

app.get("/", (req, res) => {
    async function latestUsers() {
        const userArray = await fetch('http://127.0.0.1:3000/assets/js/users.json');
        const users = await userArray.json();
        res.render(__dirname + "/snippet/index", {arr: users.data.map(element => element.ge)});
    } try {
        latestUsers();
    } catch(error) {
        console.log(error);
    }
});

app.get("/users", (req, res) => {
    async function callTheAPI() {
        const response = await fetch('http://127.0.0.1:3000/assets/js/users.json');
        const users = await response.json();
        res.render(__dirname + "/snippet/users", {arr: users.data.map(element => element.ge)});
    }
    try {
        callTheAPI();
    } catch(error) {
        console.log("Something went wrong..");
        throw new Error(error);
    }
});

app.get("/constitution", (req, res) => {
    res.render(__dirname + "/snippet/constitution");
});

// --------------------Card Sides----------------
const generateQR = (text) => {
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 1,
      margin: 0,
      color: {
        dark: "#000",
        light: "#ffffff00",
      },
    };
    let generatedval = QRCode.toDataURL(text, opts);
    return generatedval;
  };


app.get("/user/:id", (req, res) => {
    async function fetchUsers() {
        const response = await fetch(`http://127.0.0.1:3000/assets/js/users.json`);
        const users = await response.json();
    
        let QRValue = await generateQR(`http://127.0.0.1:3000/user/${req.params.id}`);
        let obj = users.data[req.params.id];
        obj.qr = QRValue;
    
        res.render(__dirname + "/snippet/profile", obj);
      }
      fetchUsers();
})

app.get("/cards-download", (req, res) => {

    let arr=fs.readdirSync('assets/pdf')
    res.render(__dirname + "/snippet/card-download", { arr: arr});
});

app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`)); 