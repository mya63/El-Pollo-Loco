/**
 * Base class for all status bars.
 * Displays a percentage-based bar using predefined images.
 */
class StatusBar extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];

  /** @type {number} Current percentage value (0–100) */
  percentage = 100;

  /**
   * Creates the status bar and initializes it to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Sets the percentage value and updates the displayed image.
   * @param {number} percentage - Percentage value (0–100).
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

/**
 * Resolves the image index based on the current percentage.
 * @returns {number} Image index.
 */
resolveImageIndex() {
  if (this.percentage >= 100) return 5; 
  if (this.percentage > 80) return 4;   
  if (this.percentage > 60) return 3;   
  if (this.percentage > 40) return 2;   
  if (this.percentage > 0) return 1;    
  return 0;                             
}

}
