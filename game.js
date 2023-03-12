canvas = document.getElementById("canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let height = canvas.height;
let width = canvas.width;


let distance = 2000

context = canvas.getContext("2d");
let N = Math.random() * 6 + 1

function draw(context, pos, r, color = "red") {
    context.beginPath();
    context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
}


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(that) {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    scale(dt) {
        return new Vector(this.x * dt, this.y * dt);
    }

    minus(that) {
        return new Vector(this.x - that.x, this.y - that.y);
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normal() {
        return new Vector(this.x / this.len(), this.y / this.len());
    }

    static proV2(len, angle) {
        return new Vector(len * Math.cos(angle), len * Math.sin(angle))
    }

    distance(that) {
        let dx = this.x - that.x
        let dy = this.y - that.y

        return Math.sqrt(dx * dx + dy * dy)
    }

}


class Bullet {
    constructor(pos, vel) {
        this.pos = pos;
        this.vel = vel;
    }

    update(dt) {
        this.pos = this.pos.plus(this.vel.scale(dt * bulletSpeed));
        console.log(this.pos);
    }

    render(context) {
        draw(context, this.pos, bullet_radius, "yellow");
    }
}

let bullets = [];
let keydown = new Set();
let start = 0;

let r = 50;
let cx = 100;
let cy = 100;
let speed = 500;
let bulletSpeed = 2000;
let particleSpeed = 2000;
let bullet_radius = 10;
let enemySpeed = 200
let spawnRate = 1
let currentRate = spawnRate
let particle_radius =10

let directionMap = {
    KeyA: new Vector(-speed, 0),
    KeyD: new Vector(speed, 0),
    KeyW: new Vector(0, -speed),
    KeyS: new Vector(0, speed),
};

class Player {
    constructor(pos, vel) {
        this.pos = pos
        this.vel = vel
    }

    render(context) {
        draw(context, this.pos, r);
    }
}

class Particle {
    constructor(pos,vel) {
        this.pos = pos
        this.vel = vel
        this.r = particle_radius
    }

    update(dt) {
        this.pos = this.pos.plus(this.vel.scale(dt*particleSpeed))
    }

    render(context) {
        draw(context, this.pos, this.r, 'blue');
    }
}


class Enemy {
    constructor(pos) {
        this.pos = pos
        this.dead = false

    }

    update(dt, toPos) {
        this.pos = this.pos.plus(toPos.minus(this.pos).normal().scale(dt * enemySpeed))
    }

    render(context) {
        draw(context, this.pos, r, 'blue');
    }
}

function spawnEnemies(toPos) {
    let enemyPos = Vector.proV2(distance * Math.random(), 2 * Math.PI * Math.random()).plus(toPos)
    return new Enemy(enemyPos)
}

class Game {
    constructor() {
        this.player = new Player(new Vector(100, 100), new Vector(0, 0))
        this.bullets = []
        this.keyPressed = new Set();
        this.enermies = [];
        this.particles = []

    }

    update(dt) {

        for (let e of this.keyPressed) {
            if (e in directionMap) {
                this.player.pos = this.player.pos.plus(directionMap[e].scale(dt))
            }
        }

        this.bullets = bullets.filter(bullet => !(bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.x > canvas.width || bullet.pos.y > canvas.height))
        for (let b of bullets) {
            b.update(dt)
        }

        currentRate = currentRate - dt
        if (currentRate < 0) {
            currentRate = spawnRate
            this.enermies.push(spawnEnemies(this.player.pos))
        }

        for (let b of bullets) {
            for (let e of this.enermies) {
                if (b.pos.distance(e.pos)<r + bullet_radius) {
                    e.dead = true
                    let N = Math.random()*6+1
                    for(let i=0;i<N;i++) {
                        let angle = Math.random()*2*Math.PI
                        this.particles.push(new Particle(e.pos,Vector.proV2(1,angle)))
                    }
                }
            }
        }


        this.enermies = this.enermies.filter(e=>!e.dead)

        this.enermies.forEach(e => e.update(dt, this.player.pos))
        this.particles.forEach(e => e.update(dt))

    }

    render(context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.player.render(context)
        for (let b of this.bullets) {
            b.render(context)
        }

        this.enermies.forEach(e => e.render(context))
        this.particles.forEach(e => e.render(context))

    }

    keydown(e) {
        this.keyPressed.add(e.code);

    }

    keyup(e) {
        this.keyPressed.delete(e.code);
    }

    mousedown(e) {
        let pos = new Vector(e.offsetX, e.offsetY);
        let v = pos.minus(this.player.pos).normal();
        bullets.push(new Bullet(this.player.pos, v));
    }

}


(() => {
    let game = new Game();

    function step(timestamp) {
        let dt = 0;
        if (start == 0) {
            start = timestamp;
        } else {
            dt = (timestamp - start) * 0.001;
            start = timestamp;
        }

        game.update(dt)
        game.render(context);

        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);

    window.addEventListener("keydown", (e) => {
        game.keydown(e);
    });

    window.addEventListener("keyup", (e) => {
        game.keyup(e)
    });

    window.addEventListener("mousedown", (e) => {
        game.mousedown(e);
    });
})();

