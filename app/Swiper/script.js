const draggableCard = document.getElementById("draggableCard");

let isDragging = false;
let startPositionX = 0;
let currentTranslateX = 0;

draggableCard.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  startPositionX = e.clientX - currentTranslateX;
  draggableCard.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const newX = e.clientX - startPositionX;
    currentTranslateX = newX;
    draggableCard.style.transform = `translateX(${newX}px)`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  draggableCard.style.cursor = "grab";
  if (Math.abs(currentTranslateX) > 100) {
    draggableCard.classList.toggle("flipped");
  }
  currentTranslateX = 0;
  draggableCard.style.transform = "translateX(0)";
});
