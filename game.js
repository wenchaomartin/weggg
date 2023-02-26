(() => {
    let r = 50
    let cx = 100
    let cy = 100
    let speed = 20
    canvas = document.getElementById("canvas")
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext('2d')
    window.addEventListener('keydown',(e) => {
        console.log(e.code)
        switch(e.code){            
            case "KeyA": cx -= speed ;break;
            case "KeyD": cx += speed ;break;
            case "KeyW": cy -= speed ;break;
            case "KeyS": cy += speed ;break;
        }
    });

    function step(timestamp) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.beginPath();
        context.arc(cx, cy, r, 0, 2 * Math.PI, false);
        context.fillStyle = '#FF0000';
        context.fill();
       
        window.requestAnimationFrame(step)
    }

    window.requestAnimationFrame(step)
})()

