var initialTouchY;
var swipeThreshold = 100;
var deltaY;
var popup;
popup = document.getElementById("popup-container");

function showPopup(dom) {
  popup = document.createElement("div");
  popup.innerHTML = dom;
  popup.id = "popup-container";
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
  popup.style.transform = "translateY(100%)";
  setTimeout(() => {
    popup.remove();
  }, 300);
}

function handleTouchStart(event) {
  initialTouchY = event.touches[0].clientY;
  if (initialTouchY > popup.offsetTop + 20) {
    initialTouchY = null; // Reset if not within the top 20px
  }
}

function handleTouchMove(event) {
  if (initialTouchY === null) return; // Ignore if touch did not start within the top 20px
  deltaY = -(event.touches[0].clientY - initialTouchY);

  if (deltaY < 0) {
    var string = "translateY(" + -deltaY + "px)";
    popup.style.transform = string;
  }

  if (deltaY < 0 && Math.abs(deltaY) > swipeThreshold) {
    hidePopup();
  }
}

function handleTouchEnd() {
  if (
    initialTouchY !== null &&
    !(deltaY < 0 && Math.abs(deltaY) > swipeThreshold)
  ) {
    popup.style.transform = "translateY(0)";
    initialTouchY = null;
  }
}
