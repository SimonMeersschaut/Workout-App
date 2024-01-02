var initialTouchY;
var swipeThreshold = 100;
var deltaY;
// var popup;
// popup = document.getElementById("popup-container");

function showPopup(dom) {
  //remove all pupups
  hidePopup()
  var popup = document.createElement("div");
  popup.innerHTML = dom;
  popup.id = "popup-container";
  popup.classList.add('popup')
  document.body.onclick = hidePopup();
  document.body.appendChild(popup);
}

function hidePopup() {
  element = document.getElementById('popup-container')
  if (element !== null){
    element.remove()
  }
}