class Chicken extends MovableObject {
  y = 360; height = 55; width = 70;
  hp = 1; damage = 10; alive = true;           // Deutsch: Werte für Leben/Schaden
  IMAGES_WALKING = ['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'];

  constructor(x, speed) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = typeof x==='number'?x:200+Math.random()*500;
    this.speed = typeof speed==='number'?speed:0.15+Math.random()*0.5;
    this.animate();
  }

  die(){ this.alive=false; this.speed=0; }     // Deutsch: Tod markieren, Bewegung stoppen

  animate(){
    setInterval(()=>{ if(this.alive) this.moveLeft(); }, 1000/60);
    setInterval(()=>{ if(this.alive) this.playAnimation(this.IMAGES_WALKING); }, 200);
  }
}