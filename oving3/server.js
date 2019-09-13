var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();
var pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql-ait.stud.idi.ntnu.no",
    user: "andrtoln",
    password: "7ChfTzkc",
    database: "andrtoln",
    debug: false
});
app.use(bodyParser.json());
// Fetches all articles, or the given article identified with article_id in the URI
app.get("/article/:id?", function (req, res) {
    console.log("Fetched request form server");
    pool.getConnection(function (err, connection) {
        console.log("Connected to database");
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            var query = "SELECT article_id, title, article_text, created_at, image, importance FROM article";
            var val = void 0;
            if (req.params.id) {
                query = "SELECT article_id, title, article_text, created_at, image, importance FROM article WHERE article_id = ?";
                val = req.params.id;
            }
            connection.query(query, val, function (err, rows) {
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
// Format: title: String, article_text: string, importance: integer
app.post("/article", function (req, res) {
    console.log("Recieved POST-request from client");
    console.log("..." + req.body.title + " " + req.body.article_text + " " + req.body.importance);
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            var val = [req.body.title, req.body.article_text, req.body.importance];
            var query = "INSERT INTO article (title, article_text, importance) VALUES (?,?,?)";
            connection.query(query, val, function (err) {
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
app["delete"]("/article/:id", function (req, res) {
    console.log("Recieved DELETE-request from client");
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            var query = "DELETE FROM article WHERE article_id = ?;";
            var val = req.params.id;
            connection.query(query, val, function (err) {
                if (err) {
                    connection.release();
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
// Format: title: String, article_text: string, importance: integer
app.put("/article/:id", function (req, res) {
    console.log("Recieved PUT-request form client");
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Connection error");
            res.json({ error: "Connection error" });
        }
        else {
            console.log("Established connection to database");
            var val = [req.body.title, req.body.article_text, req.body.importance, req.params.id];
            var query = "UPDATE article SET title = ?, article_text = ?, importance = ? WHERE article_id = ?;";
            connection.query(query, val, function (err) {
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
var server = app.listen(8080);
