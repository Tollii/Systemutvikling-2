let myButton = document.querySelector("#myButton");
myButton.addEventListener("click", e => {
  console.log("Fikk klikk-event");
  let url = "/login";
  const data =   {
    "brukernavn": document.getElementById('username').value,
    "passord": document.getElementById('password').value
  };
  console.log(data);
  fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(json => handleResponse(json))
  .catch(error => console.error("Error: ", error));
});

const handleResponse = json => {
  console.log(json);
  const url = "/api/person";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-access-token": json.jwt
    }
  })
  .then(response => response.json())
  .then(json => console.log(JSON.stringify(json)))
  .catch(error => console.error("Error: ", error));
};
