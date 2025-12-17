/**
 * Represents a throwable bottle object.
 * The bottle moves forward and can slightly home towards nearby enemies.
 */
class ThrowableObject extends MovableObject {

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
    this.dir = dir || 1;
    this.speed = 8;
    this.throw();
  }

  /**
   * Finds the nearest alive enemy in the world.
   * @returns {Object|null} Nearest enemy or null if none found.
   */
  findNearestEnemy() {
    if (typeof world === 'undefined' || !world || !world.level) return null;
    const enemies = world.level.enemies || [];
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || !e.alive) continue;

      const dx = (e.x + e.width / 2) - (this.x + this.width / 2);
      const dy = (e.y + e.height / 2) - (this.y + this.height / 2);
      const dist = dx * dx + dy * dy;

      if (dist < minDist) {
        minDist = dist;
        nearest = e;
      }
    }
    return nearest;
  }

  /**
   * Starts the throw movement loop.
   * The bottle moves forward and slightly homes in on nearby enemies.
   * @returns {void}
   */
  throw() {
    setInterval(() => {
      if (this.broken) return;

      const target = this.findNearestEnemy();
      if (target) {
        this.moveTowardsTarget(target);
      } else {
        this.x += this.dir * this.speed;
      }
    }, 1000 / 60);
  }

  /**
   * Moves the bottle towards a target enemy with slight randomness.
   * @param {Object} target - Target enemy.
   * @returns {void}
   */
  moveTowardsTarget(target) {
    let dx = (target.x + target.width / 2) - (this.x + this.width / 2);
    let dy = (target.y + target.height / 2) - (this.y + this.height / 2);
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 350) {
      dx += (Math.random() - 0.5) * 100;
      dy += (Math.random() - 0.5) * 100;
      dist = Math.sqrt(dx * dx + dy * dy);
      if (!dist) return;
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    } else {
      this.x += this.dir * this.speed;
    }
  }
}
