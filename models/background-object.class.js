// Deutscher Kommentar: Kachel exakt in Canvas-Größe
class BackgroundObject extends MovableObject {
  constructor(path, x) {
    super().loadImage(path);
    this.x = x; this.y = 0;
    this.width = 720;  // exakt Canvas-Breite
    this.height = 480; // exakt Canvas-Höhe
  }
}
