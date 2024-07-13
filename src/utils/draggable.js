import { onUnmounted } from "vue";
export default function useDraggable(refElem) {
  const move = (e) => {
    if (!refElem.value) return;

    refElem.value.x += e.movementX;
    refElem.value.y += e.movementY;
  };

  const release = (e) => {
    console.log("-- mouseup ", refElem);
    refElem.value = null;
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", release);

  onUnmounted(() => {
    document.addEventListener("mousemove", move);
    document.removeEventListener("mouseup", release);
  });
}
