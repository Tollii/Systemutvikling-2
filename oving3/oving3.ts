const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.send("Henlo, world");
});

app.get("/hello2", (req, res) => {
  res.json({"hello world": "Hello world"});
});

var server = app.listen(8080);

process.on('SIGTERM', server.close());
