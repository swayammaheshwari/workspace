const swiper = new Swiper(".swiper", {
  loop: true,
  slidesPerView: 4,
  centeredSlides: true,
  autoplay: {
    enabled: true,
    delay: 5000,
  },
});

let mouseCursor = document.querySelector(".cursor-img");
let isDragging = false;

window.addEventListener("mousemove", cursor);
window.addEventListener("mousedown", startDrag);
window.addEventListener("mouseup", stopDrag);

function cursor(e) {
  if (!isDragging) {
    mouseCursor.style.top = e.pageY + "px";
    mouseCursor.style.left = e.pageX + "px";
  }
}

function startDrag(e) {
  isDragging = true;
}

function stopDrag(e) {
  isDragging = false;
}
