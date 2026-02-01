export function bindKeyboard(input) {
  window.addEventListener("keydown", (e) => {
    if (input.isChatting) return;
    if (e.key === "w") input.up = true;
    if (e.key === "s") input.down = true;
    if (e.key === "a") input.left = true;
    if (e.key === "d") input.right = true;
  });

  window.addEventListener("keyup", (e) => {
    if (input.isChatting) return;
    if (e.key === "w") input.up = false;
    if (e.key === "s") input.down = false;
    if (e.key === "a") input.left = false;
    if (e.key === "d") input.right = false;
  });
}
