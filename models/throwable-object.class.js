/**
 * Represents a throwable bottle object.
 * Bottle flies in a curve (gravity) and rotates.
 */
class ThrowableObject extends MovableObject {
  angle = 0;
  rotSpeed = 18;
  vx = 12;
  vy = 18;
  g = 0.9;
  groundY = 360;
  flyInterval = null;
  lifeTime = 300;

  /**
   * Creates a new throwable object.
   * @param {number} x - Start x position.
   * @param {number} y - Start y position.
   * @param {number} dir - Throw direction (1 = right, -1 = left).
   */
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

  /**
   * Starts the throw loop.
   * @returns {void}
   */
  throw() {
    this.stop();
    this.flyInterval = setInterval(() => this.stepThrow(), 1000 / 60);
  }

  /**
   * Updates throw physics per frame.
   * @returns {void}
   */
  stepThrow() {
    if (this.broken) return this.stop();
    this.x += this.vx;
    this.y -= this.vy;
    this.vy -= this.g;
    this.angle = (this.angle + this.rotSpeed) % 360;
    if (this.y >= this.groundY) this.stop();
  }

  /**
   * Stops the internal interval.
   * @returns {void}
   */
  stop() {
    if (!this.flyInterval) return;
    clearInterval(this.flyInterval);
    this.flyInterval = null;
  }

  /**
   * Draws the bottle rotated around its center.
   * @param {CanvasRenderingContext2D} ctx - Canvas context.
   * @returns {void}
   */
  draw(ctx) {
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
