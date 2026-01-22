export function bindMouseAim(canvas, input, getPlayerPosition) {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const { x, y } = getPlayerPosition();
        
        input.angle = Math.atan2(mouseY - y, mouseX - x);
    })
}