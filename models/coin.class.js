/**
 * Represents a collectible coin.
 * Coins are animated and can be collected by the player.
 */
class Coin extends MovableObject {
  width = 80;
  height = 80;

  IMAGES = [
    'img/8_coin/coin_1.png',
    'img/8_coin/coin_2.png'
  ];

  /**
   * Creates a new coin at a given position.
   * @param {number} x - X position of the coin.
   * @param {number} y - Y position of the coin.
   */
  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the coin animation loop.
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 300);
  }
}
