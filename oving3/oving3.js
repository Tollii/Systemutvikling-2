import express from 'express';
const app = express();
app.get("/hello", (req, res) => {
    res.send("Henlo, world");
});
app.get("/hello2", (req, res) => {
    res.json({ "hello world": "Hello world" });
});
const server = app.listen(8080);
