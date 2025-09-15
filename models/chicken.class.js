class Chicken extends MovableObject {
y = 350; height = 60; width = 70;
hp = 1; damage = 10; alive = true;
IMAGES_WALKING = [
'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
];
IMAGES_DEAD = [ 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png' ];


constructor(x){
super().loadImage(this.IMAGES_WALKING[0]);
this.loadImages(this.IMAGES_WALKING);
this.loadImages(this.IMAGES_DEAD);
this.x = x;
this.speed = 0.15 + Math.random() * 0.25;
this.animate();
}


animate(){
setInterval(()=>{ if(this.alive) this.moveLeft(); }, 1000/60);
setInterval(()=>{ if(this.alive) this.playAnimation(this.IMAGES_WALKING); }, 200);
}


die(){
 this.alive = false;
 this.deadTime = Date.now();
 this.playAnimation(this.IMAGES_DEAD);
}
}


