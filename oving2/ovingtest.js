const fetch = require("node-fetch");
function postData(url = "", data = {}){
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => console.log(JSON.stringify(json)))
  .catch(error => console.error("Error:" + error));
}
let result = postData("http://bigdata.stud.iie.ntnu.no/sentiment/webresources/sentiment/log?api-key=Happy!!!", {sentence: "something"});
console.log(result);
