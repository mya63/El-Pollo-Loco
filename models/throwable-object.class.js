class ThrowableObject extends MovableObject {

  constructor(x, y, dir) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.dir = dir || 1;
    this.speed = 8;
    this.trow();
  }

findNearestEnemy(){
  if(typeof world === 'undefined' || !world || !world.level) return null;
  let enemies = world.level.enemies || [];
  let nearest = null;
  let min = Infinity;
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    if(!e || !e.alive) continue;
    let dx = (e.x + e.width/2) - (this.x + this.width/2);
    let dy = (e.y + e.height/2) - (this.y + this.height/2);
    let dist = dx*dx + dy*dy;
    if(dist < min){ min = dist; nearest = e; }
  }
  return nearest;
}

trow(){
  setInterval(()=>{
    if(this.broken) return;
    let target = this.findNearestEnemy();
    if(target){
      let dx = (target.x + target.width/2) - (this.x + this.width/2);
      let dy = (target.y + target.height/2) - (this.y + this.height/2);
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 350){
        dx += (Math.random()-0.5) * 100;
        dy += (Math.random()-0.5) * 100;
        dist = Math.sqrt(dx*dx + dy*dy);
        if(dist){
          this.x += (dx/dist) * this.speed;
          this.y += (dy/dist) * this.speed;
        }
      } else {
        this.x += this.dir * this.speed;
      }
    } else {
      this.x += this.dir * this.speed;
    }
  }, 1000/60);
}
}
