function load_calendar(){
  fetch('/api/user_data/active_days/'+last_segment())
  .then(response => response.json())
  .then(data => {
    const calendarContainer = document.getElementById('calendar');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
    const startingDay = new Date(currentDate.getFullYear(), currentMonth, 1).getDay();
    const today = new Date().getDay()
    streak = 0
    recup = false
    for (let day = 1; day <= daysInMonth + startingDay; day++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      current_day = day - startingDay;
      if (day > startingDay) {
        dayElement.textContent = current_day;
      }
      /* Styling */
      if (recup){
        dayElement.classList.add('recup')
      }
      if (today == current_day){
        dayElement.classList.add('today')
      }
      if (data['data'].includes(current_day)){
        dayElement.classList.add('active')
        streak += 1
        recup = true
      }else{
        if (recup){
          streak += 1
        }
        recup = false;
      }
      /* */

      // Ensure that Monday is considered the first day of the week
      const adjustedDay = (day + 5) % 7 + 1;
      dayElement.style.gridColumn = adjustedDay === 8 ? 1 : adjustedDay;

      // You can add additional logic or events here

      calendarContainer.appendChild(dayElement);
    }
  });
}
function appendToTable(value1, value2) {
  // Get the table body
  var tableBody = document.getElementById("myTable").getElementsByTagName('tbody')[0];

  // Create a new row
  var newRow = tableBody.insertRow(tableBody.rows.length);

  // Insert cells with the provided values
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);

  // Set the cell values
  cell1.innerHTML = value1;
  cell2.innerHTML = value2;
}
function load_prs(){
  fetch('/api/user_data/prs/'+last_segment())
  .then(response => response.json())
  .then(data => {
    console.log(data)
    for (var key in data['data']){
      value = `${data['data'][key]['value']} (${data['data'][key]['reps']})`
      name = data['data'][key]['name']
      appendToTable(name, value)
    }
  })
}