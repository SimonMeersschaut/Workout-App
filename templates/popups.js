var initialTouchY;
var swipeThreshold = 100;
var deltaY;
var popup;
popup = document.getElementById("popup-container");

function showPopup(dom) {
  //remove all pupups
  popups = document.getElementsByClassName('popup')
  for (let i=0; i<popups.length; i++){
    popups[i].remove()
  }
  popup = document.createElement("div");
  popup.innerHTML = dom;
  popup.id = "popup-container";
  popup.classList.add('popup')
  popup.ontouchstart = handleTouchStart;
  popup.ontouchmove = handleTouchMove;
  popup.ontouchend = handleTouchEnd;
  document.body.appendChild(popup);
  /* trigger the animation */
  setTimeout(() => {
    popup.style.transform = "translateY(0)";
  }, 10);
}

function hidePopup() {
  popup.remove();
}

function handleTouchStart(event) {
  deltaY = 0;
  initialTouchY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (initialTouchY === null) return; // Ignore if touch did not start within the top 20px
  deltaY = -(event.touches[0].clientY - initialTouchY);

  if (deltaY < 0) {
    var string = "translateY(" + -deltaY + "px)";
    popup.style.transform = string;
  }
}

function handleTouchEnd() {
  if (deltaY < 0 && Math.abs(deltaY) > swipeThreshold) {
    hidePopup();
  }
  if (
    initialTouchY !== null &&
    !(deltaY < 0 && Math.abs(deltaY) > swipeThreshold)
  ) {
    popup.style.transform = "translateY(0)";
    initialTouchY = null;
  }
}
