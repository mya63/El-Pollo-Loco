class ThrowableObject extends MovableObject {

  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.trow();
  }

trow(){ 
  this.speedY = 12;        
  this.acceleration = 2.2;  
  this.applyGravity();      
  let vx = 8;               
  setInterval(()=>{ this.x += vx; }, 25);
}
}
