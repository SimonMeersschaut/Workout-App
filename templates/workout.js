const currentNumbers = { selector1: 0, selector2: 0, selector3: 0 };
var allExercices = []
var isEditing = false;
// let click_handler = null;

function addExercice(parent, data) {
  element = createElementFromHTML(`\
  <div class="exercice draggable ${(data['done'] == true) ? 'static-done' : ''}" id="${data['id']}">\
    <h2>${data['name']}</h2>\
    <div class="additional-info">
      <span>${data['weight']}kg (${data['sets']}x${data['reps']})</span>
    </div>
  </div>`);
  element.style.cursor = "pointer";
  // let data = data['id']
  element.addEventListener('mousedown', (event) => {startDrag(event, data)})
  element.addEventListener('touchstart', (event) => {startDrag(event, data)})
  parent.appendChild(element);
}

///////////////////
/* START OF DRAG */
///////////////////
let offsetX, offsetY, offsetScroll;
let scrollMode;
var isDragging = false;
let currentDraggable;
let timePress = 0;
var newX = 0;
var id_copy = null;

function startDrag(e, data) {
  data_copy = data;
  e.preventDefault();
  const eventType = e.type === 'touchstart' ? e.touches[0] : e;
  let target = eventType.target;
  // CHECK TO REMOVE POPUP
  while (target && !target.classList.contains('popup')) {
    target = target.parentElement;
  }

  if (target) {
    // on popup
  }
  else{
    removed = hidePopup()
  }
  if (!removed){
    // RUN SLIDING MECHANISM
    target = eventType.target;
  
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
        const touchEvent = e.type === 'touchstart' ? e.touches[0] : e;
        offsetX = touchEvent.clientX// - currentDraggable.getBoundingClientRect().left;
        offsetY = touchEvent.clientY// - currentDraggable.getBoundingClientRect().left;
        offsetScroll = window.scrollY;
        // console.log(offsetScroll)

        // Set scrollmode to starting position
        scrollMode = undefined;
  
        // Set the flag to indicate dragging has started
        isDragging = true;
  
        // Attach the drag and mouseup event listeners
        // document.removeEventListener('mouseup', () => {stopDrag(click_handler)})
        // document.removeEventListener('touchend', () => {stopDrag(click_handler)})
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', () => {stopDrag(data_copy)});
        document.addEventListener('touchend', () => {stopDrag(data_copy)});
      }
  }
}

function drag(e) {
  e.preventDefault(); 
  // console.log('draggin')
  const eventType = e.type === 'touchmove' ? e.touches[0] : e;

  if (isDragging) {
      // Calculate the new horizontal and vertical drag
      newX = eventType.clientX - offsetX;
      newY = eventType.clientY - offsetY - offsetScroll;

      if (scrollMode == undefined){
        // no mode triggered yet
        // TODO
        if (Math.abs(newX) > 50){
          scrollMode = 1 // horizontal scroll mode
        }
        else{
          if (Math.abs(newY) > 50){
            scrollMode = 2 // vertical scroll mode
          }
        }
        
      }

      if (scrollMode == 1){
        // Set the new horizontal position using the transform property
        currentDraggable.style.transform = `translateX(${newX}px)`;
      }
      if (scrollMode == 2){
        // Bind the Y offset to the scroll
        window.scrollTo(0, -newY);
      }
  }
}

function stopDrag(data) {
    // Reset the offset values and flag
    if (currentDraggable !== null){
      // if touchend and mouseup are bein registered, this will handle the error
      currentDraggable.style.transform = `translateX(0px)`;
      offsetX = 0;
      offsetY = 0;
      isDragging = false;
      currentDraggable = null;
      // console.log(new Date().getTime() - timePress)
      if (new Date().getTime() - timePress < 400){
        // short press/slide
        if (newX < 50){
          // short click
          click_handler_copy()
        }
      }
      if (newX > 100){
        console.log('[dev] adding rep')
        // register rep
        workout_id = parseInt(last_segment());
        fetch("/api/add_rep", {
          method: "POST",
          body: JSON.stringify({
            exercice_id: data['id'],
            weight: data['weight'],
            sets: 1,
            reps: data['reps'],
            workout_id: workout_id
          }),
        })
        .then(resp => resp.json())
        .then(data => {
          alert(`You did ${data['data']['sets']} sets.`)
        });
      }
      // if (newX < -100){
      //   isEditing = true;
      //   showWorkoutPopup(data, (id) => {SubmitExercice(data['id'])});

      // }
  
      // Remove the event listeners when dragging stops
      // document.removeEventListener('mousemove', drag);
      // document.removeEventListener('touchmove', drag);
      document.onmouseup = () => {console.log('ok')};
      document.ontouchend = null;
    }
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