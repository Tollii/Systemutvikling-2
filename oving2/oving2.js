let submit = document.querySelector("#submit");
let input = document.querySelector("#input");
let title = document.querySelector("#title");
title.innerHTML = "FOcker";

submit.addEventListener("click", e => {
  let sentence = input.value;
  let url = "http://bigdata.stud.iie.ntnu.no/sentiment/webresources/sentiment/log?api-key=Happy!!!";
  let data = {
    sentence: sentence
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => handleResponse(json.value))
  .catch(error => console.error("Error:" + error));
});

function handleResponse(json){
  title.innerHTML = json;
  switch (json) {
    case 0:
      document.getElementById("doc").classList.add('html0')
      break;
    case 1:
      document.getElementById("doc").classList.add('html1')
      break;
    case 2:
      document.getElementById("doc").classList.add('html2')
      break;
    case 3:
      document.getElementById("doc").classList.add('html3')
      break;
    case 4:
      document.getElementById("doc").classList.add('html4')
      break;

    default:

  }
}
