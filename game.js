
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

let r = 50;
let cx = 100;
let cy = 100;
let speed = 500;
let bulletSpeed = 2000;
let bullet_radius = 10;
let directionMap = {
  KeyA: new Vector(-speed, 0),
  KeyD: new Vector(speed, 0),
  KeyW: new Vector(0, -speed),
  KeyS: new Vector(0, speed),
};

class Player{
  constructor(pos,vel){
    this.pos = pos
    this.vel =vel
  }

  render(context){
      draw(context,this.pos,r);
  }
}

class Game{
  constructor(){
    this.player = new Player(new Vector(100, 100),new Vector(0,0))
    this.bullets = []
    this.keyPressed = new Set();
  }

  update(dt){

      for ( let e of this.keyPressed){
        if (e in directionMap){
            this.player.pos = this.player.pos.plus(directionMap[e].scale(dt))
        }
      }

      this.bullets = bullets.filter(bullet => !(bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.x > canvas.width || bullet.pos.y > canvas.height))
      for(let b of bullets){
          b.update(dt)
      }
      
  }

  render(context){
    this.player.render(context)
    for(let b of this.bullets){
      b.render(context)
    }
  }

  keydown(e){
    this.keyPressed.add(e.code);

  }

  keyup(e){
    this.keyPressed.delete(e.code);
  }

  mousedown(e){
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
    context.clearRect(0, 0, canvas.width, canvas.height);
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

