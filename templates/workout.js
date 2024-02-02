const currentNumbers = { selector1: 0, selector2: 0, selector3: 0 };
var allExercices = []
var isEditing = false;

function addExercice(parent, data) {
  element = createElementFromHTML(`\
  <div class="exercice draggable ${(data['done'] == true) ? 'static-done' : ''}" id="${data['id']}">\
    <h2>${data['name']}</h2>\
    <div class="additional-info">
      <span>${data['weight']}kg (${data['sets']}x${data['reps']})</span>
    </div>
  </div>`);
  element.style.cursor = "pointer";
  // onclick = () => showWorkoutPopup(data, (id) => {SubmitExercice(id)});
  element.addEventListener('mousedown', (event) => {startDrag(event)})
  parent.appendChild(element);
}

///////////////////
/* START OF DRAG */
///////////////////
let offsetX, offsetY;
var isDragging = false;
let currentDraggable;
let timePress = 0;
var newX = 0;

document.addEventListener('mousedown', startDrag);

function startDrag(e) {
  let target = e.target;

  // Check if the target or any of its ancestors have the class '.draggable'
  while (target && !target.classList.contains('draggable')) {
      target = target.parentElement;
  }

  if (target) {
      currentDraggable = target;
      currentDraggable.style.transition = 'transform .1s'
      timePress = new Date().getTime();
      newX = 0;

      // Store the initial position of the mouse pointer relative to the draggable element
      offsetX = e.clientX// - currentDraggable.getBoundingClientRect().left;

      // Set the flag to indicate dragging has started
      isDragging = true;

      // Attach the drag and mouseup event listeners
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
    }
}

function drag(e) {
    if (isDragging) {
        // Calculate the new horizontal position of the dragged element
        newX = e.clientX - offsetX;

        // Set the new horizontal position using the transform property
        currentDraggable.style.transform = `translateX(${newX}px)`;
    }
}

function stopDrag() {
    // Reset the offset values and flag
    currentDraggable.style.transform = `translateX(0px)`;
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    currentDraggable = null;
    // console.log(new Date().getTime() - timePress)
    if (new Date().getTime() - timePress < 400){
      // short press
      if (newX < 50){
        // short click
        alert('short click')
      }
    }

    // Remove the event listeners when dragging stops
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}
/*             */
/* END OF DRAG */
/*             */

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
        window.location.reload()
      }else{
        alert('error')
      }
    })
  }else{
    // is not editing
    fetch("/api/submitExercice", {
      method: "POST",
      body: JSON.stringify({
        exercice_id: id,
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
            return; // repititions should not be marked
            // setTimeout(() => {exercices[i].remove()}, 1900)
          }
        }
      }
    });
  }
  hidePopup();
}


function showWorkoutPopup(data, onSubmit) {
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
  </table><button id="submitButton" style="margin-top: 20px; width: calc(100% - 25px);">${(isEditing) ? 'Edit' : 'Done'}</button>`;
  showPopup(dom);
  document.getElementById('submitButton').onclick = () => {
    weight = currentNumbers["selector1"]
    sets = currentNumbers["selector2"]
    reps = currentNumbers["selector3"]
    onSubmit(data['id'], weight, sets, reps)
  }
}


function addNewExercice(){
  ExercicePopup((name) => {
    hidePopup()
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
  })
}

function ExercicePopup(onFound){
  fetch('/api/allExercices')
  .then(response => response.json())
  .then(data => {
    allExercices = data['data'].map(obj => obj['name']);
  })
  showPopup(
    `<div>
      <h2>Find Exercice</h2>
      <br>
      <input id="SearchEntry" style="width: 150px">
      <button id="addCustomExerciceButton">+</button>
      <div id="SearchResultContainer">
      </div>
    </div>`)
    document.getElementById('SearchEntry').oninput = () => {
      updateSearch(onFound)
    }
    document.getElementById('addCustomExerciceButton').onclick = () => {
      value = document.getElementById('SearchEntry').value;
      onFound(value)
    }
}
function updateSearch(onFound){
  
  value = document.getElementById('SearchEntry').value;
  // console.log(value)
  searchResults = searchEngine(value, allExercices)
  container = document.getElementById('SearchResultContainer')
  container.innerHTML = ''
  for (let i= 0;  i<searchResults.length; i++){
    line = document.createElement('p')
    line.innerText = searchResults[i]['result']
    line.onclick = () => {onFound(searchResults[i]['result'])}
    container.appendChild(line)
  }
}