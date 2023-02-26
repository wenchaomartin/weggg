(() => {
    canvas = document.getElementById("canvas")
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext('2d')
    context.arc(100, 100, 50, 0, 2 * Math.PI, false);

    context.fillStyle = '#FF0000';
    context.fill();
})()