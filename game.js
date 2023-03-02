
canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
context = canvas.getContext("2d");

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
let circle = new Vector(100, 100);

let r = 50;
let cx = 100;
let cy = 100;
let speed = 500;
let bulletSpeed = 2000;
let bullet_radius = 10;
let directtionMap = {
  KeyA: new Vector(-speed, 0),
  KeyD: new Vector(speed, 0),
  KeyW: new Vector(0, -speed),
  KeyS: new Vector(0, speed),
};

(() => {
  function step(timestamp) {
    let dt = 0;
    if (start == 0) {
      start = timestamp;
    } else {
      dt = (timestamp - start) * 0.001;
      start = timestamp;
    }

    for (e of keydown.values()) {
      if (e in directtionMap) {
        let v = directtionMap[e];
        circle = circle.plus(v.scale(dt));
      }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    bullets = bullets.filter(bullet => !(bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.x > canvas.width || bullet.pos.y > canvas.height))
    for (b of bullets) {
      b.update(dt);
      b.render(context);
    }

    draw(context, circle, r);

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);

  window.addEventListener("keydown", (e) => {
    keydown.add(e.code);
  });

  window.addEventListener("keyup", (e) => {
    keydown.delete(e.code);
  });

  window.addEventListener("mousedown", (e) => {
    let pos = new Vector(e.offsetX, e.offsetY);
    let v = pos.minus(circle).normal();
    bullets.push(new Bullet(circle, v));
  });
})();
