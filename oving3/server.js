const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql-ait.stud.idi.ntnu.no",
    user: "andrtoln",
    password: "7ChfTzkc",
    database: "andrtoln",
    debug: false
});
app.get("/article", (req, res) => {
    console.log("Fetched request form server");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            connection.query("SELECT article_id, title, article_text, created_at, image, importance FROM article", (err, rows) => {
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
app.post("/article", (req, res) => {
    console.log("Recieved POST-request from client");
    console.log("..." + req.body.title + " " + req.body.article_text + " " + req.body.importance);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            const val = [req.body.title, req.body.article_text, req.body.importance];
            connection.query("INSERT INTO article (title, article_text, importance) VALUES (?,?,?)", val, err => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ error: "Error with INSERT" });
                }
                else {
                    console.log("Success");
                    res.send("Record has been created");
                }
            });
        }
    });
});
app.delete("/article", (req, res) => {
    console.log("Recieved DELETE-request from client");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            connection.query(`DELETE FROM article WHERE article_id = ?;`, [req.body.id], err => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ error: "Error with DELETE" });
                }
                else {
                    console.log("Success");
                    res.send("Record has been deleted");
                }
            });
        }
    });
});
app.put("/article", (req, res) => {
    console.log("Recieved PUT-request form client");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            const val = [req.body.title, req.body.article_text, req.body.importance, req.body.id];
            console.log(val);
            connection.query(`UPDATE article SET title = ?, article_text = ?, importance = ? WHERE article_id = ?;`, val, err => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ error: "Error with PUT" });
                }
                else {
                    console.log("Success");
                    res.send("Record has been updated");
                }
            });
        }
    });
});
const server = app.listen(8080);
