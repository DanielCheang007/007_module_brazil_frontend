export default function useDraggable(refElem) {
  document.addEventListener("mousemove", (e) => {
    if (!refElem.value) return;

    refElem.value.x += e.movementX;
    refElem.value.y += e.movementY;
  });

  document.addEventListener("mouseup", (e) => {
    refElem.value = null;
  });
}
