
function renderWorkouts(data){
  var parent = document.getElementById('workouts-container')
  innerHTML = ''
  for (let i=0; i<data.length; i++){
    let workout_data = data[i]
    // var displayName = data['name'].replace(/[^a-zA-Z0-9]/g, '')
    console.log('/'+workout_data['username']+"/workouts/"+workout_data['id'])
    addItem(
      workout_data['id'],
      parent,
      () => {window.location = "/workouts/"+workout_data['id']},
      () => {alert('cool')},
      workout_data['title'],
      workout_data['description']
    )
  }
}

function addItem(id, parent, onclick, onedit, title, description) {
  element = createElementFromHTML(`<div id="${id}">
  ${onedit ? `<button class="edit_button">edit</button>` : ""}
  <h2>${title}</h2>\
  ${description ? `<span>${description}</span>` : ""}
    </div>`);
  // if (onclick) {
    // element.onclick = onclick;
    // element.style.cursor = "pointer";
  // }
  element.addEventListener('click', (e) => {
    // alert('editing now')
    console.log(e.target)
    if (e.target.classList.contains('edit_button')){
      showPopup(`
        <div>
        <input id="editWorkoutTitle" style="width: 150px;" placeholder="name" value="${title}">
        <input id="editWorkoutDescirption" style="width: 150px;" placeholder="name" value="${description}">
        <br><br>
        <button onclick="saveEdit(${id})">Save</button>
        </div>`
      )
    }
    else{
      onclick()
    }
  })
  parent.appendChild(element);
}


function saveEdit(id){
  title = document.getElementById('editWorkoutTitle').value;
  description = document.getElementById('editWorkoutDescirption').value;
  fetch('/api/editWorkout', {
    method: 'POST',
    body: JSON.stringify({'id': id, 'title': title, 'description': description})
  })
  .then(response => response.json())
  .then(data => {
    if (data['success'] == true){
      window.location.reload()
    }else{
      // alert('error')
    }
  })
}