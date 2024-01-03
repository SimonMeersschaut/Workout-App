function load_calendar(){
  fetch('/api/user_data/active_days/'+last_segment())
  .then(response => response.json())
  .then(data => {
      var streak = 0;
      const calendarContainer = document.getElementById('calendar');
      const daysInMonth = 31
      const startingDay = new Date().getDay(); // Get the current day of the week
  
      for (let day = 1; day <= daysInMonth + startingDay; day++) {
        current_day = day - startingDay + 1
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.id = current_day
        if (startingDay == current_day){
          dayElement.classList.add('today')
        }
        if (data['data'].includes(current_day)){
          dayElement.classList.add('active');
          streak += 1;
          var recup = true;
        }
        else{
          if (recup){
            dayElement.classList.add('recup') 
            streak += 1;
          }
          recup = false;
        }
  
  
        if (current_day > 0) {
          dayElement.textContent = current_day;
        }
  
        // Ensure that Monday is considered the first day of the week
        const adjustedDay = (day + 5) % 7;
        dayElement.style.gridColumn = adjustedDay === 0 ? 7 : adjustedDay;
  
        // You can add additional logic or events here
  
        calendarContainer.appendChild(dayElement);
        document.getElementById('streak').innerText = `Streak: ${streak}`;
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
      value = data['data'][key]['value']
      name = data['data'][key]['name']
      appendToTable(name, value)
    }
  })
}