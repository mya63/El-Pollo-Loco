/**
 * Represents a collectible bottle on the ground.
 * Bottles can be animated and collected by the player.
 */
class Bottle extends MovableObject {
  height = 60;
  width = 50;
  y = 360;
  collected = false;

  IMAGES_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];

  /**
   * Creates a new bottle at a given x position.
   * @param {number} x - X position of the bottle.
   */
  constructor(x) {
    super();
    this.loadImage(this.IMAGES_GROUND[0]);
    this.loadImages(this.IMAGES_GROUND);
    this.x = x;
    this.animate();
  }

  /**
   * Starts the ground animation while the bottle is not collected.
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      if (!this.collected) this.playAnimation(this.IMAGES_GROUND);
    }, 400);
  }

  /**
   * Marks the bottle as collected.
   * @returns {void}
   */
  collect() {
    this.collected = true;
  }
}
