class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    plus(that){
        return new Vector(this.x + that.x, this.y + that.y);
    }
    scale(dt){
        return new Vector(this.x *dt, this.y *dt);
    }
}

let keydown = new Set();
let start=0;
let circle = new Vector(100,100);




(() => {
    let r = 50
    let cx = 100
    let cy = 100
    let speed = 500
    //todo circle move not smooth
    canvas = document.getElementById("canvas")
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext('2d')

    let directtionMap = {
        "KeyA": new Vector(-speed, 0),
        "KeyD": new Vector(speed, 0),
        "KeyW": new Vector(0, -speed),
        "KeyS": new Vector(0, speed)
    }
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "KeyA": keydown.add("KeyA"); break;
            case "KeyD": keydown.add("KeyD"); break;
            case "KeyW": keydown.add("KeyW");break;
            case "KeyS": keydown.add("KeyS");break;
        }
    });

    window.addEventListener('keyup', (e) => {
        switch (e.code) {
            case "KeyA": keydown.delete("KeyA");break;
            case "KeyD": keydown.delete("KeyD");break;
            case "KeyW": keydown.delete("KeyW");break;
            case "KeyS": keydown.delete("KeyS");break;
        }
    });


    function draw(context,pos,r){
        console.log(circle.x, circle.y)
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.beginPath();
        context.arc(pos.x, pos.y , r, 0, 2 * Math.PI, false);
        context.fillStyle = '#FF0000';
        context.fill();
    }


    function step(timestamp) {
        let dt = 0;
        let sx = 0;
        let sy = 0;
        
        if (start==0) {
            start = timestamp
        } else {
            dt = (timestamp - start) * 0.001
            start = timestamp
        }

        for(e of  keydown.values()){
            if (e in directtionMap) {
                let v = directtionMap[e]
                circle = circle.plus(v.scale(dt))
            }
        }
        
        draw(context,circle,r)

        window.requestAnimationFrame(step)
    }

    window.requestAnimationFrame(step)
})()

