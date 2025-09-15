class SmallChicken extends MovableObject {
y = 390; height = 45; width = 50;
hp = 1; damage = 10; alive = true;
IMAGES_WALKING = [
'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'];
IMAGES_DEAD = [ 'img/3_enemies_chicken/chicken_small/2_dead/dead.png' ];


constructor(x, speed){
super().loadImage(this.IMAGES_WALKING[0]);
this.loadImages(this.IMAGES_WALKING);
this.loadImages(this.IMAGES_DEAD);
this.x = typeof x==='number'?x:200+Math.random()*500;
this.speed = typeof speed==='number'?speed:0.3+Math.random()*0.6;
this.animate();
}


die(){
 this.alive=false; this.speed=0;
 this.deadTime = Date.now();
 this.playAnimation(this.IMAGES_DEAD);
}


animate(){
setInterval(()=>{ if(this.alive) this.moveLeft(); }, 1000/60);
setInterval(()=>{ if(this.alive) this.playAnimation(this.IMAGES_WALKING); }, 200);
}
}