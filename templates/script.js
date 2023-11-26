const exercises = ["Squats", "Push-ups", "Plank", "Lunges", "Jumping Jacks"];
let currentExerciseIndex = 0;

function nextExercise() {
  currentExerciseIndex = (currentExerciseIndex + 1) % exercises.length;
  const currentExercise = exercises[currentExerciseIndex];
  document.querySelector(
    ".exercise-container p"
  ).innerText = `Current Exercise: ${currentExercise}`;
}

function Workouts() {
  // You can replace this with code to display workout content
  window.location.href = "/workout";
}

function Profile() {
  // You can replace this with code to display profile content
  window.location.href = "/profile";
}
