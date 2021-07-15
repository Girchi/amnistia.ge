import express, { response } from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import * as fs from 'fs';

const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


app.set("view engine", "pug");

app.use("/assets", express.static('assets'));

app.get("/", (req, res) => {
    res.render(__dirname + "/snippet/index", { message: "Hello world"});
});

app.get("/users", (req, res) => {
    res.render(__dirname + "/snippet/users", { message: "Hello world"});
});

app.get("/constitution", (req, res) => {
    res.render(__dirname + "/snippet/constitution");
});

// --------------------Card Sides----------------

app.get("/user/:id", (req, res) => {
    let obj={};
    fetch('http://127.0.0.1:3000/assets/js/users.json')
    .then(response => response.json())
    .then(data => {
        obj=data.data[req.params.id];
    });
    setTimeout(()=>{
        res.render(__dirname + "/snippet/profile", obj);
    }, 100);
})

app.get("/cards-download", (req, res) => {

    let arr=fs.readdirSync('assets/pdf')
    res.render(__dirname + "/snippet/card-download", { arr: arr});
});

app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`)); 