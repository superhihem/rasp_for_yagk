const rasp = require("./rasp");
const pjson = require("./package.json");
const express = require("express");
const app = express();
const port = 3000;

let visits = 0;
let date = new Date();
let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
let visits_text = () => { return `Запросов сегодня: ${visits} <br>Последнее обновление сервера: ${time} <br> Версия: ${pjson.version} <br> Автор: ${pjson.author}`; }

app.get("/", (req, res) => {
    rasp.parse(data => res.send(data));
});

app.get("/public", (req, res) => {
    res.charset = "utf8";
    visits++;
    rasp.parse(data => {
        let table = "";
        data.forEach(row => {
            let table_row = "";
            for(let cell in row){
                table_row += `<td>${row[cell]}</td>`;
            }
            table += `<tr>${table_row}</tr>`;
        });
        table = `<table>${table}</table><br><br><br><small>${visits_text()}</small>`;
        res.send(table);
    });
});

app.get("/public/:group", (req, res) => {
    res.charset = "utf8";
    visits++;
    rasp.parse(data => {
        let table = "";
        data.forEach(row => {
            let table_row = "";
            for(let cell in row){
                table_row += `<td>${row[cell]}</td>`;
            }
            table += `<tr>${table_row}</tr>`;
        });

        table = `<table>${table}</table><br><br><br><small>${visits_text()}</small>`;
        res.send(table);
    }, {
        group: req.params["group"].toUpperCase(),
        sort_by: "Номер"
    });
});

app.get("/:group", (req, res) => {
    rasp.parse(data => res.send(data), {
        group: req.params["group"].toUpperCase(),
        sort_by: "Номер"
    });
});

app.listen(port);