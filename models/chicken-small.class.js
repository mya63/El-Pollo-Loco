class SmallChicken extends MovableObject {
  y = 390; height = 45; width = 50;
  hp = 1; damage = 10; alive = true;           // Deutsch: kleine Hühner, 1 HP
  IMAGES_WALKING = ['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'];

  constructor(x, speed){
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = typeof x==='number'?x:200+Math.random()*500;
    this.speed = typeof speed==='number'?speed:0.3+Math.random()*0.6;
    this.animate();
  }

  die(){ this.alive=false; this.speed=0; }

  animate(){
    setInterval(()=>{ if(this.alive) this.moveLeft(); }, 1000/60);
    setInterval(()=>{ if(this.alive) this.playAnimation(this.IMAGES_WALKING); }, 200);
  }
}