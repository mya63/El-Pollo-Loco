/**
 * Status bar that displays the collected coin percentage.
 * Uses orange coin images and updates based on percentage value.
 */
class StatusBarCoin extends DrawableObject {
  IMAGES = {
    0:   'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    20:  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    40:  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    60:  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    80:  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    100: 'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
  };

  /**
   * Creates the coin status bar and initializes it.
   */
  constructor() {
    super();
    this.x = 38; //  below health bar
    this.y = 80;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage value and updates the displayed image.
   * @param {number} p - Percentage value (0–100).
   * @returns {void}
   */
  setPercentage(p) {
    this.percentage = Math.max(0, Math.min(100, p));
    this.loadImage(this.IMAGES[this.getKey()]);
  }

  /**
   * Resolves the image key based on current percentage.
   * @returns {number} Image key (0, 20, 40, 60, 80, 100).
   */
  getKey() {
    if (this.percentage >= 100) return 100;
    if (this.percentage >= 80) return 80;
    if (this.percentage >= 60) return 60;
    if (this.percentage >= 40) return 40;
    if (this.percentage >= 20) return 20;
    return 0;
  }
}
