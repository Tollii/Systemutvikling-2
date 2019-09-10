const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const pool = mysql.createPool({
    connectionLimit: 2,
    host: "...",
    user: "...",
    password: "...",
    database: "...",
    debug: false
});
app.get("/person", (req, res) => {
    console.log("Fetched request form server");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            connection.queryy("SELECT nav, alder adresse FROM person", (err, rows) => {
                connection.release();
                if (err) {
                    console.log(err);
                    res.json({ error: "Query error" });
                }
                else {
                    console.log(rows);
                    res.json(rows);
                }
            });
        }
    });
});
app.use(bodyParser.json());
app.post("/test", (req, res) => {
    console.log("Recieved POST-request from client");
    console.log("... " + req.body.navn);
    res.status(200);
    res.json({ message: "success" });
});
app.post("/person", (req, res) => {
    console.log("Recieved POST-request from client");
    console.log("..." + req.body.navn);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            const val = [req.body.navn, req.body.adresse, req.body.alder];
            connection.query("INSERT INTO person (navn, adresse, alder) VALUES (?,?,?)", val, err => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ error: "Error with INSERT" });
                }
                else {
                    console.log("Success");
                    res.send("");
                }
            });
        }
    });
});
const server = app.listen(8080);
