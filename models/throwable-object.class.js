/**
 * Represents a throwable bottle object.
 * Bottle flies in a curve (gravity) and rotates.
 */
class ThrowableObject extends MovableObject {
  angle = 0;          // [MYA NEW] Rotationswinkel in Grad
  rotSpeed = 18;      // [MYA NEW] Drehgeschwindigkeit
  vx = 12;            // [MYA NEW] X-Geschwindigkeit
  vy = 18;            // [MYA NEW] Start nach oben
  g = 0.9;            // [MYA NEW] Schwerkraft
  groundY = 360;      // [MYA NEW] Bodenlinie (anpassen wenn nötig)
  flyInterval = null; // [MYA NEW] Interval-ID
  lifeTime = 300; // [MYA NEW] ms nach Aufprall sichtbar


  constructor(x, y, dir) {
    super();
    this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.vx = this.vx * (dir || 1);
    this.throw();
  }

  throw() {
    // [MYA NEW] Kurve + Rotation
    this.stop();
    this.flyInterval = setInterval(() => this.stepThrow(), 1000 / 60);
  }

  stepThrow() {
    // [MYA NEW] Physik pro Frame
    if (this.broken) return this.stop();
    this.x += this.vx;
    this.y -= this.vy;
    this.vy -= this.g;
    this.angle = (this.angle + this.rotSpeed) % 360;
    if (this.y >= this.groundY) this.stop();
  }

  stop() {
    // [MYA NEW] verhindert Endlos-Intervalle
    if (!this.flyInterval) return;
    clearInterval(this.flyInterval);
    this.flyInterval = null;
  }

  draw(ctx) {
    // [MYA NEW] rotiertes Zeichnen um die Mitte
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
