// models/chicken-small.class.js
class SmallChicken extends MovableObject {
  y = 390; height = 45; width = 50;
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  constructor(x, speed) {
    super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.x = typeof x === 'number' ? x : 200 + Math.random() * 500;
    this.speed = typeof speed === 'number' ? speed : 0.3 + Math.random() * 0.6;
    this.animate();
  }

  animate() {
    setInterval(() => { this.moveLeft(); }, 1000 / 60);
    setInterval(() => { this.playAnimation(this.IMAGES_WALKING); }, 200);
  }
}
