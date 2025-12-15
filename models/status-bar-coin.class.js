// [MYA NEU] Coin-Statusbar (orange)
class StatusBarCoin extends DrawableObject {
  IMAGES = {
    0: 'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    20:'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    40:'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    60:'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    80:'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    100:'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
  };

  constructor() {
    super();
    this.x = 38; this.y = 80; // [MYA] unter Health-Bar
    this.width = 200; this.height = 60;
    this.setPercentage(0);
  }

  setPercentage(p) {
    this.percentage = Math.max(0, Math.min(100, p));
    this.loadImage(this.IMAGES[this.getKey()]);
  }

  getKey() {
    if (this.percentage >= 100) return 100;
    if (this.percentage >= 80) return 80;
    if (this.percentage >= 60) return 60;
    if (this.percentage >= 40) return 40;
    if (this.percentage >= 20) return 20;
    return 0;
  }
}
