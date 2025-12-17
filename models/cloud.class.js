/**
 * Represents a moving cloud in the background.
 * Clouds move slowly from right to left for a parallax effect.
 */
class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  /**
   * Creates a new cloud with a random x position.
   */
  constructor() {
    super();
    this.loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts cloud movement.
   * @returns {void}
   */
  animate() {
    this.moveLeft();
  }
}
