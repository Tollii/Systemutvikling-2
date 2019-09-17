const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var app = express();
app.use(bodyParser.json()); // for å tolke JSON i body

// Setter opp mysql kobling
const raw = fs.readFileSync('config.json');
const config = JSON.parse(raw);
const pool = mysql.createPool(config);

// Burde vært ekte sertifikat, lest fra config...
let privateKey = (publicKey = "shhhhhverysecret");

function loginOk(username, password) {
  return password == "secret";
}

// Server klientapplikasjonen (i public-mappa) på rot-url'en http://localhost:8080
app.use(express.static("public"));

// Håndterer login og sender JWT-token tilbake som JSON
app.post("/login", (req, res) => {
  if (loginOk(req.body.brukernavn, req.body.passord)) {
    console.log("Brukernavn & passord ok");
    let token = jwt.sign({ brukernavn: req.body.brukernavn }, privateKey, {
      expiresIn: 60
    });
    res.json({ jwt: token });
  } else {
    console.log("Brukernavn & passord IKKE ok");
    res.status(401);
    res.json({ error: "Not authorized" });
  }
});

// Plasserer denne MÌDDLEWARE-funksjonen
// foran alle endepunktene under samme path
app.use("/api", (req, res, next) => {
  var token = req.headers["x-access-token"];
  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) {
      console.log("Token IKKE ok");
      res.status(401);
      res.json({ error: "Not authorized" });
    } else {
      console.log("Token ok: " + decoded.brukernavn);
      next();
    }
  });
});

app.get("/api/person", (req, res) => {
  console.log("Skal returnere en liste med personer");
  res.json([{ name: "Hei Sveisen" }]);
});

app.get("/api/person/:personId", (req, res) => {
  console.log("Skal returnere personen med id " + req.params.personId);
  res.json({ name: "Hei Sveisen" });
});

app.post("/api/person", (req, res) => {
  console.log("Skal legge til en ny person i DB");
  res.send("");
});

var server = app.listen(8080);
