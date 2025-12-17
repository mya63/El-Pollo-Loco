/**
 * Base class for all drawable objects.
 * Handles image loading, drawing and basic animation caching.
 */
class DrawableObject {
  /** @type {HTMLImageElement} Current image */
  img;

  /** @type {Object<string, HTMLImageElement>} Cached images */
  imageCache = {};

  /** @type {number} Index of the current animation image */
  currentImage = 0;

  /** @type {number} X position */
  x = 120;

  /** @type {number} Y position */
  y = 280;

  /** @type {number} Object height */
  height = 150;

  /** @type {number} Object width */
  width = 100;

  /**
   * Loads a single image.
   * @param {string} path - Image path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around certain objects.
   * Used for collision visualization.
   * @param {CanvasRenderingContext2D} ctx - Canvas context.
   * @returns {void}
   */
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Loads multiple images into the cache.
   * @param {Array<string>} arr - List of image paths.
   * @returns {void}
   */
  loadImages(arr) {
    for (let i = 0; i < arr.length; i++) {
      const path = arr[i];
      const img = new Image();
      img.src = path;
      img.style = 'transform: scaleX(-1)';
      this.imageCache[path] = img;
    }
  }
}
