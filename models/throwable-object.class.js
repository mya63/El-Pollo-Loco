class ThrowableObject extends MovableObject {

  constructor(x, y, dir) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.dir = dir || 1;
    this.trow();
  }

trow(){
  this.speedY = 15;
  this.acceleration = 2.2;
  this.applyGravity();
  let vx = 12 * this.dir;
  setInterval(()=>{ this.x += vx; }, 25);
}
}
