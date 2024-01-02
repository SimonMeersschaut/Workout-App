
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