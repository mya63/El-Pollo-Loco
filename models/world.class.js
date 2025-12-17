/**
 * Represents the game world (logic part).
 * Rendering methods are in world.render.js to keep files under 400 lines.
 */
class World {
  character = new Character();
  level = level1;
  canvas; ctx; keyboard;
  camera_x = 0; bossFocus = false;
  statusBar = new StatusBar();
  bottleBar = new StatusBarBottle();
  bossBar = new StatusBarEndboss();
  coinBar = new StatusBarCoin(); // [MYA FIX]
  throwableObjects = {};
  bottleCount = 0;
  coinCount = 0; // [MYA FIX]
  coinMax = 0;   // [MYA FIX]

  /**
   * @param {HTMLCanvasElement} canvas - Canvas element.
   * @param {Keyboard} keyboard - Keyboard state.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.coinMax = (this.level.coins || []).length; // [MYA FIX]
    this.coinBar.setPercentage(0); // [MYA FIX]
    this.run();
    this.draw(); // kommt aus world.render.js
  }

  /**
   * Links world to character and starts animation once.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    if (this._animStarted) return;
    this._animStarted = true;
    this.character.animate();
  }

  /**
   * AABB collision check.
   * @param {Object} a - First object.
   * @param {Object} b - Second object.
   * @returns {boolean} True if colliding.
   */
  isColliding(a, b) {
    return a.x + a.width > b.x && a.y + a.height > b.y &&
           a.x < b.x + b.width && a.y < b.y + b.height;
  }

  /**
   * Checks if player stomped an enemy.
   * @param {MovableObject} c - Character.
   * @param {MovableObject} e - Enemy.
   * @returns {boolean} True if stomp.
   */
  isStomp(c, e) {
    const falling = c.speedY < 0;
    const above = c.y + c.height - e.y < 30;
    return falling && above;
  }

  /**
   * Starts all game loops.
   * @returns {void}
   */
  run() {
    this.startMainLoop();
    this.startThrowLoop();
    this.startCoinLoop();
  }

  /**
   * Main loop at ~60 FPS.
   * @returns {void}
   */
  startMainLoop() { // [MYA NEW]
    this.runInterval = setInterval(() => {
      this.checkCollisions();
      this.checkBottleHits();
      this.checkBottlePickups();
      this.checkEndbossIntro();
      this.checkGameOver();
    }, 1000 / 60);
  }

  /**
   * Throw loop at ~60 FPS.
   * @returns {void}
   */
  startThrowLoop() { // [MYA NEW]
    this.throwInterval = setInterval(() => {
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  /**
   * Coin loop (lightweight).
   * @returns {void}
   */
  startCoinLoop() { // [MYA NEW]
    this.coinInterval = setInterval(() => {
      this.checkCoinCollision();
    }, 100);
  }

  /**
   * Handles bottle throwing.
   * @returns {void}
   */
  checkThrowObjects() {
    if (!this.keyboard.D || this.bottleCount <= 0) return;
    const dir = this.character.otherDirection ? -1 : 1;
    const x = this.character.x + (dir === 1 ? this.character.width : -20);
    const y = this.character.y + 100;
    const id = 't_' + Date.now() + '_' + Math.random(); // [MYA NEW]
    this.throwableObjects[id] = new ThrowableObject(x, y, dir); // [MYA NEW]
    this.afterThrow();
  }

  /**
   * Updates UI after throwing and resets key.
   * @returns {void}
   */
  afterThrow() { // [MYA NEW]
    this.bottleCount--;
    this.bottleBar.setPercentage(Math.min(this.bottleCount, 5) * 20);
    playThrowSound();
    this.keyboard.D = false;
  }

  /**
   * Checks coin collisions and updates coin bar.
   * @returns {void}
   */
  checkCoinCollision() {
    const coins = this.level.coins || [];
    for (let i = 0; i < coins.length; i++) {
      if (!this.isColliding(this.character, coins[i])) continue;
      coins.splice(i, 1); i--;
      this.coinCount++;
      this.coinBar.setPercentage(this.getCoinPercent());
    }
  }

  /**
   * Calculates the coin percentage.
   * @returns {number} 0..100
   */
  getCoinPercent() { // [MYA FIX]
    if (this.coinMax <= 0) return 0;
    return (this.coinCount / this.coinMax) * 100;
  }

  /**
   * Checks bottle pickups and updates bottle bar.
   * @returns {void}
   */
  checkBottlePickups() {
    const bottles = this.level.bottles || [];
    for (let i = 0; i < bottles.length; i++) {
      const bo = bottles[i];
      if (!bo || bo.collected) continue;
      if (!this.isColliding(this.character, bo)) continue;
      bo.collect();
      this.bottleCount++;
      this.bottleBar.setPercentage(Math.min(this.bottleCount, 5) * 20);
    }
  }

  /**
   * Checks game over state once.
   * @returns {void}
   */
  checkGameOver() {
    if (!this.character.isDead() || this.gameOverShown) return;
    this.gameOverShown = true;
    showGameOver();
  }

  /**
   * Checks collisions with enemies.
   * @returns {void}
   */
  checkCollisions() { // [MYA FIX] forEach -> for
    const enemies = this.level.enemies || [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e.alive === false) continue;
      if (this.isColliding(this.character, e)) this.resolveCollision(e);
    }
  }

  /**
   * Resolves collision result: stomp or damage.
   * @param {MovableObject} e - Enemy.
   * @returns {void}
   */
  resolveCollision(e) {
    if (this.isStomp(this.character, e)) this.handleStomp(e);
    else this.hitPlayer(e.damage || 10);
  }

  /**
   * Applies stomp damage.
   * @param {MovableObject} e - Enemy.
   * @returns {void}
   */
  handleStomp(e) {
    const dmg = e instanceof Chicken || e instanceof SmallChicken ? (e.hp || 1) : 1;
    this.hitEnemy(e, dmg);
  }

  /**
   * Damages an enemy and updates boss bar if needed.
   * @param {MovableObject} e - Enemy.
   * @param {number} d - Damage.
   * @returns {void}
   */
  hitEnemy(e, d) {
    if (!e || !e.alive) return;
    if (e.takeDamage) e.takeDamage(d);
    else { e.hp = (e.hp || 1) - d; if (e.hp <= 0 && e.die) e.die(); }
    if (e instanceof Endboss && this.bossBar) {
      this.bossBar.setPercentage((Math.max(e.hp, 0) / e.maxHp) * 100);
    }
  }

  /**
   * Damages the player and updates status bar.
   * @param {number} d - Damage.
   * @returns {void}
   */
  hitPlayer(d) {
    if (!this.character || !this.character.hit || this.character.isHurt()) return;
    this.character.hit(d);
    this.statusBar.setPercentage((this.character.energy / this.character.maxEnergy) * 100);
  }

  /**
   * Checks bottle hits against enemies.
   * @returns {void}
   */
  checkBottleHits() { // [MYA CHANGE] Objekt statt Array
    for (let id in this.throwableObjects) {
      const t = this.throwableObjects[id];
      if (!t || t.broken) continue;
      if (this.tryBottleHit(t)) t.broken = true;
    }
  }

  /**
   * Tries to hit any enemy with a bottle.
   * @param {ThrowableObject} t - Bottle.
   * @returns {boolean} True if hit.
   */
  tryBottleHit(t) { // [MYA NEW]
    const enemies = this.level.enemies || [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || !e.alive) continue;
      if (!this.isColliding(t, e)) continue;
      this.hitEnemy(e, 1);
      return true;
    }
    return false;
  }

  /**
   * Checks if boss intro should start.
   * @returns {void}
   */
  checkEndbossIntro() { // [MYA FIX] forEach -> for
    const enemies = this.level.enemies || [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e instanceof Endboss && !e.hadFirstContact) this.tryStartBossIntro(e);
    }
  }

  /**
   * Starts boss intro when player is close enough.
   * @param {Endboss} e - Endboss.
   * @returns {void}
   */
  tryStartBossIntro(e) {
    if (this.character.x <= e.x - 600) return;
    e.startIntro();
    this.bossBar.visible = true;
    this.bossBar.setPercentage((e.hp / e.maxHp) * 100);
    this.bossFocus = true;
    this.camera_x = -(e.x - 200);
    setTimeout(() => (this.bossFocus = false), 1600);
  }

  /**
   * Stops loops and drawing.
   * @returns {void}
   */
  stop() {
    this.isStopped = true;
    if (this.runInterval) clearInterval(this.runInterval);
    if (this.throwInterval) clearInterval(this.throwInterval);
    if (this.coinInterval) clearInterval(this.coinInterval); // [MYA NEW]
  }
}
