class Bottle extends MovableObject {
  height = 60; width = 50; y = 360; collected = false;
  IMAGES_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];
  constructor(x){
    super().loadImage(this.IMAGES_GROUND[0]);
    this.loadImages(this.IMAGES_GROUND);
    this.x = x;
    this.animate();
  }
  animate(){
    setInterval(()=>{ if(!this.collected) this.playAnimation(this.IMAGES_GROUND); }, 400);
  }
  collect(){
    this.collected = true;
  }
}
