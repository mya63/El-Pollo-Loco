class Chicken extends MovableObject {
  y = 360; height = 55; width = 70;
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];

  constructor(x, speed) {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    // Deutscher Kommentar: übergebene Startwerte nutzen, sonst Fallback
    this.x = typeof x === 'number' ? x : 200 + Math.random() * 500;
    this.speed = typeof speed === 'number' ? speed : 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    // Deutscher Kommentar: Bewegung + Animation
    setInterval(() => { this.moveLeft(); }, 1000 / 60);
    setInterval(() => { this.playAnimation(this.IMAGES_WALKING); }, 200);
  }
}
