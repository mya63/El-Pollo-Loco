/**
 * Represents a static background object in the level.
 * Used for parallax and scenery elements.
 */
class BackgroundObject extends MovableObject {

  /**
   * Creates a new background object.
   * @param {string} path - Image path of the background object.
   * @param {number} x - X position in the level.
   */
  constructor(path, x) {
    super();
    this.loadImage(path);
    this.x = x;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }
}
