/**
 * Base class for all movable objects.
 * Extends DrawableObject with movement, gravity and combat logic.
 */
class MovableObject extends DrawableObject {
  /** @type {number} Horizontal movement speed */
  speed = 0.15;

  /** @type {boolean} True if object is facing left */
  otherDirection = false;

  /** @type {number} Vertical speed (jump / gravity) */
  speedY = 0;

  /** @type {number} Gravity acceleration */
  acceleration = 2.5;

  /** @type {number} Current energy / health */
  energy = 100;

  /** @type {number} Timestamp of last hit */
  lastHit = 0;

  /**
   * Applies gravity to the object.
   * Updates vertical position and speed continuously.
   * @returns {void}
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks whether the object is above ground.
   * Throwable objects are always treated as above ground.
   * @returns {boolean} True if object is above ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < 180;
  }

  /**
   * Axis-aligned bounding box collision check.
   * @param {MovableObject} mo - Other movable object.
   * @returns {boolean} True if objects collide.
   */
  isCollided(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Applies damage to the object.
   * @param {number} [damage=20] - Damage amount.
   * @returns {void}
   */
  hit(damage = 20) { // [MYA NEW]
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = Date.now(); // [MYA NEW]
  }

  /**
   * Checks if the object is currently hurt (invulnerable phase).
   * @returns {boolean} True if recently hit.
   */
  isHurt() { // [MYA NEW]
    return (Date.now() - this.lastHit) < 300;
  }

  /**
   * Checks whether the object is dead.
   * @returns {boolean} True if energy is zero.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Plays an animation from a list of images.
   * @param {Array<string>} images - Image paths.
   * @returns {void}
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    const path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump.
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
  }
}
