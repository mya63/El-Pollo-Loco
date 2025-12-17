/**
 * Status bar that displays the current bottle amount.
 * Updates visually based on percentage value.
 */
class StatusBarBottle extends StatusBar {
  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
  ];

  /**
   * Creates the bottle status bar and initializes it.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;
    this.y = 40;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }
}
