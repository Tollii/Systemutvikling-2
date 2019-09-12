let myButton = document.querySelector("#myButton");

myButton.addEventListener("click", e => {
  console.log("Fikk klikk-event");
  let url = "api/person/1";
  fetch(url, {
      method: "GET",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      }
  })
    .then(response => response.json())
    .then(json => console.log(JSON.stringify(json)))
    .catch(error => console.error("Error: ", error));
});
