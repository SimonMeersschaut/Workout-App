const exercises = ["Squats", "Push-ups", "Plank", "Lunges", "Jumping Jacks"];
let currentExerciseIndex = 0;
function last_segment(){
  return window.location.pathname.split("/").pop()
}
function nextExercise() {
  currentExerciseIndex = (currentExerciseIndex + 1) % exercises.length;
  const currentExercise = exercises[currentExerciseIndex];
  document.querySelector(
    ".exercise-container p"
  ).innerText = `Current Exercise: ${currentExercise}`;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;1
}

function addItem(parent, onclick, title, description) {
  element = createElementFromHTML(`<div><h2>${title}</h2>\
  ${description ? `<span>${description}</span>` : ""}
    </div>`);
  if (onclick) {
    element.onclick = onclick;
    element.style.cursor = "pointer";
  }
  parent.appendChild(element);
}
function addExercice(parent, data) {
  element = createElementFromHTML(`\
  <div class="exercice ${(data['done'] == true) ? 'static-done' : ''}" id="${data['id']}">\
    <h2>${data['name']}</h2>\
      <table class="additional-info">\
        <td class="info-field active"><span class="header">weight</span><br><span>${data['weight']}</span></td>\
        <td class="info-field"><span class="header">sets</span><br><span>${data['sets']}</span></td>\
        <td class="info-field"><span class="header">reps</span><br><span>${data['reps']}</span></td>\
      </table>\
  </div>`);
  element.onclick = () => showWorkoutPopup(data);
  element.style.cursor = "pointer";
  parent.appendChild(element);
}

const currentNumbers = { selector1: 0, selector2: 0, selector3: 0 };

function updateNumber(selectorId, change) {
  // Check if the currentNumbers object has a property for the given selector
  if (!currentNumbers.hasOwnProperty(selectorId)) {
    currentNumbers[selectorId] = 0; // If not, initialize it with 0
  }

  // Update the current number for the specified selector
  currentNumbers[selectorId] += change;

  // Update the display for the specified selector
  document.querySelector(`#${selectorId} .currentNumber`).textContent =
    currentNumbers[selectorId];
}

function SubmitExercice(id) {
  weight = currentNumbers["selector1"];
  sets = currentNumbers["selector2"];
  reps = currentNumbers["selector3"];
  workout_id = parseInt(last_segment());

  if (isEditing){
    // editing
    fetch('/api/addNewExercice', {
      method: 'POST',
      body: JSON.stringify({'id': id, 'workout': workout_id, 'weight':weight, 'sets':sets, 'reps':reps})
    })
    .then(response => response.json())
    .then(data => {
      if (data['success'] == true){
        alert('done')
      }else{
        alert('error')
      }
    })
  }else{
    // is not editing
    fetch("/api/submitExercice", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        weight: weight,
        sets: sets,
        reps: reps,
        workout_id: workout_id
      }),
    })
    .then(resp => resp.json())
    .then(data => {
      if (data['success'] == true){
        var exercices = document.getElementsByClassName('exercice')
        console.log(id)
        console.log(exercices)
        for (let i=0; i<exercices.length; i++){
          if (exercices[i].id == id){
            exercices[i].classList.add('done')
            // setTimeout(() => {exercices[i].remove()}, 1900)
          }
        }
      }
    });
  }
  hidePopup();
}

function showWorkoutPopup(data) {
  currentNumbers["selector1"] = data['weight']
  currentNumbers["selector2"] = data['sets']
  currentNumbers["selector3"] = data['reps']
  dom = `
  <h2>${data['name']}</h2>\
  <table class="popup-items ${(isEditing) ? 'editing' : ''}">\
    <tr>
      <td><span class="numberSelectorText">Weight</span></td>
      <td id="selector1">
        <button onclick="updateNumber('selector1', -2.5)">-</button>
        <div class="currentNumber">${data['weight']}</div>
        <button onclick="updateNumber('selector1', 2.5)">+</button>
      </td>
    </tr>
    <tr>
      <td><span class="numberSelectorText">Sets</span></td>
      <td id="selector2">
        <button onclick="updateNumber('selector2', -1)">-</button>
        <div class="currentNumber">${data['sets']}</div>
        <button onclick="updateNumber('selector2', 1)">+</button>
      </td>
    </tr>
    <tr>
      <td><span class="numberSelectorText">Reps</span></td>
      <td id="selector3">
        <button onclick="updateNumber('selector3', -1)">-</button>
        <div class="currentNumber">${data['reps']}</div>
        <button onclick="updateNumber('selector3', 1)">+</button>
      </td>
    </tr>\
  </table><button id="submitButton" onclick="SubmitExercice(${data['id']})" style="margin-top: 20px; width: calc(100% - 25px);">${(isEditing) ? 'Edit' : 'Done'}</button>`;
  showPopup(dom);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function addNewExercice(){
  let name = prompt('Naam')
  if (name != null){
    fetch('/api/addNewExercice', {
      method: 'POST',
      body: JSON.stringify({'name': name, 'workout': last_segment()})
    })
    .then(response => response.json())
    .then(data => {
      id = data['id']
      parent = document.getElementById('exercices-container')
  
      addExercice(parent, {'id':id, 'name':name, 'done': false, 'weight':0, 'reps': 13, 'sets': 3})
    })
  }
}

// check cookie
if (getCookie('username') == ''){
  setCookie('username', prompt('username'), 30)
}