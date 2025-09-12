class BackgroundObject extends MovableObject {
  constructor(path, x) {
    super().loadImage(path);
    this.x = x; this.y = 0;
    this.width = 720;  
    this.height = 480; 
  }
}
