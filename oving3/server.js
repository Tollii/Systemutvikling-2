const fs = require("fs");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
// Reads MySQL config file
const raw = fs.readFileSync('config.json');
const config = JSON.parse(raw);
const pool = mysql.createPool(config);
const app = express();
app.use(bodyParser.json());
// Fetches all articles, or the given article identified with article_id in the URI
app.get("/article/:id?", (req, res) => {
    console.log("Recieved GET-request from client");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            let query = "SELECT article_id, title, article_text, created_at, image, importance FROM article";
            let val;
            if (req.params.id) {
                query = `SELECT article_id, title, article_text, created_at, image, importance FROM article WHERE article_id = ?`;
                val = req.params.id;
            }
            connection.query(query, val, (err, rows) => {
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
// Creates a new article
// Format: title: string, article_text: string, importance: integer
app.post("/article", (req, res) => {
    console.log("Recieved POST-request from client");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            const query = "INSERT INTO article (title, article_text, importance) VALUES (?,?,?)";
            const val = [req.body.title, req.body.article_text, req.body.importance];
            connection.query(query, val, err => {
                connection.release();
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
// Deletes a given article identified with article_id in the URI
app.delete("/article/:id", (req, res) => {
    console.log("Recieved DELETE-request from client");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            const query = `DELETE FROM article WHERE article_id = ?;`;
            const val = req.params.id;
            connection.query(query, val, err => {
                connection.release();
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ error: "Error with query" });
                }
                else {
                    console.log("Success");
                    res.send("Record has been deleted");
                }
            });
        }
    });
});
// Updates a given article identified with article_id in the URI
// Format: title: string, article_text: string, importance: integer
app.put("/article/:id", (req, res) => {
    console.log("Recieved PUT-request from client");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            const query = `UPDATE article SET title = ?, article_text = ?, importance = ? WHERE article_id = ?;`;
            const val = [req.body.title, req.body.article_text, req.body.importance, req.params.id];
            connection.query(query, val, err => {
                connection.release();
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ error: "Error with INSERT" });
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
