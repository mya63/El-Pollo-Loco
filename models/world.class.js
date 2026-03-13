/**
 * Represents the game world (logic part).
 * Rendering methods are in world.render.js to keep files under 400 lines.
 */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  bossFocus = false;
  statusBar = new StatusBar();
  bottleBar = new StatusBarBottle();
  bossBar = new StatusBarEndboss();
  coinBar = new StatusBarCoin();
  throwableObjects = {};
  bottleCount = 0;
  coinCount = 0;
  coinMax = 0;
  throwLock = false;
  lastThrowTime = 0;
  throwCooldown = 650;

  /**
   * @param {HTMLCanvasElement} canvas - Canvas element.
   * @param {Keyboard} keyboard - Keyboard state.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.coinMax = (this.level.coins || []).length;
    this.coinBar.setPercentage(0);
    this.run();
    this.draw();
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
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  isDamageCollision(a, b) {
    const offsetX = 15;
    const offsetY = 5;

    return (
      a.x + a.width - offsetX > b.x + offsetX &&
      a.y + a.height - offsetY > b.y + offsetY &&
      a.x + offsetX < b.x + b.width - offsetX &&
      a.y + offsetY < b.y + b.height - offsetY
    );
  }

  /**
   * Checks if player stomped an enemy.
   * @param {MovableObject} c - Character.
   * @param {MovableObject} e - Enemy.
   * @returns {boolean} True if stomp.
   */
  isStomp(c, e) {
    const isFalling = c.speedY < 0; 
    if (!isFalling) return false; 

    const charBottom = c.y + c.height; 
    const charLeft = c.x + 25; 
    const charRight = c.x + c.width - 25; 

    const enemyTop = e.y; 
    const enemyLeft = e.x + 5; 
    const enemyRight = e.x + e.width - 5; 

    const topRange = e instanceof SmallChicken ? 20 : 25; 

    const hitsTopArea =
      charBottom >= enemyTop && charBottom <= enemyTop + topRange; 

    const overlapsX =
      charRight > enemyLeft && charLeft < enemyRight; 

    return hitsTopArea && overlapsX; 
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
  startMainLoop() {
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
  startThrowLoop() {
    this.throwInterval = setInterval(() => {
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  /**
   * Coin loop (lightweight).
   * @returns {void}
   */
  startCoinLoop() {
    this.coinInterval = setInterval(() => {
      this.checkCoinCollision();
    }, 100);
  }

  /**
   * Handles bottle throwing.
   * @returns {void}
   */
  checkThrowObjects() {
    const now = Date.now(); // [MYA NEW]

    if (!this.keyboard.D) this.throwLock = false;
    if (this.throwLock) return;
    if (!this.keyboard.D_ONCE) return;
    if (this.bottleCount <= 0) return;
    if (now - this.lastThrowTime < this.throwCooldown) return; // [MYA NEW]

    this.throwLock = true;
    this.keyboard.D_ONCE = false;
    this.lastThrowTime = now; // [MYA NEW]
    this.spawnBottle();
    this.afterThrow();
  }
  /**
   * Spawns a new throwable bottle.
   * @returns {void}
   */
  spawnBottle() {
    const dir = this.character.otherDirection ? -1 : 1;
    const x = this.character.x + (dir === 1 ? this.character.width : -20);
    const y = this.character.y + 100;
    const id = "t_" + Date.now() + "_" + Math.random();
    this.throwableObjects[id] = new ThrowableObject(x, y, dir);
  }

  /**
   * Updates UI after throwing.
   * @returns {void}
   */
  afterThrow() {
    this.bottleCount--;
    this.bottleBar.setPercentage(Math.min(this.bottleCount, 5) * 20);
    playThrowSound();
  }

  /**
   * Checks coin collisions and updates coin bar.
   * @returns {void}
   */
  /*  Coins werden jetzt erst bei echtem Kontakt eingesammelt */
  checkCoinCollision() {
    const coins = this.level.coins || [];

    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      if (!this.isCoinPickupCollision(this.character, coin)) continue;

      coins.splice(i, 1);
      i--;
      this.coinCount++;
      playSound("pickup");
      this.coinBar.setPercentage(this.getCoinPercent());
    }
  }

  /**
   * @param {MovableObject} c - Character.
   * @param {MovableObject} coin - Coin.
   * @returns {boolean} True if pickup should happen.
   */
  isCoinPickupCollision(c, coin) {
    const charLeft = c.x + 45;
    const charRight = c.x + c.width - 45;
    const charTop = c.y + 70;
    const charBottom = c.y + c.height - 80;

    const coinLeft = coin.x + 10;
    const coinRight = coin.x + coin.width - 10;
    const coinTop = coin.y + 10;
    const coinBottom = coin.y + coin.height - 10;

    return (
      charRight > coinLeft &&
      charLeft < coinRight &&
      charBottom > coinTop &&
      charTop < coinBottom
    );
  } /**
   * Calculates coin percentage.
   * @returns {number} 0..100
   */
  getCoinPercent() {
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
      if (!this.isBottlePickupCollision(this.character, bo)) continue;

      bo.collect();
      playSound("pickup");
      this.bottleCount++;
      this.bottleBar.setPercentage(Math.min(this.bottleCount, 5) * 20);
    }
  }

  /**
   * @param {MovableObject} c - Character.
   * @param {MovableObject} b - Bottle.
   * @returns {boolean} True if pickup should happen.
   */
  isBottlePickupCollision(c, b) {
    return (
      c.x + 35 < b.x + b.width &&
      c.x + c.width - 35 > b.x &&
      c.y + 40 < b.y + b.height &&
      c.y + c.height - 25 > b.y
    );
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
  checkCollisions() {
    const enemies = this.level.enemies || [];

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e.alive === false) continue; // [MYA KEEP]
      if (!this.isColliding(this.character, e)) continue; // [MYA KEEP]

      if (this.isStomp(this.character, e)) { 
        this.handleStomp(e); 
        continue; 
      }

      if (this.isDamageCollision(this.character, e)) { 
        this.hitPlayer(e.damage || 10); 
      }
    }
  }  /**
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
    const dmg =
      e instanceof Chicken || e instanceof SmallChicken ? e.hp || 1 : 1;

    this.character.speedY = 12; 
    this.hitEnemy(e, dmg); // [MYA KEEP]
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
    else {
      e.hp = (e.hp || 1) - d;
      if (e.hp <= 0 && e.die) e.die();
    }
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
    if (!this.character || !this.character.hit || this.character.isHurt())
      return;
    this.character.hit(d);
    playSound("hurt");
    this.statusBar.setPercentage(
      (this.character.energy / this.character.maxEnergy) * 100,
    );
  }

  /**
   * Checks bottle hits against enemies.
   * @returns {void}
   */
  checkBottleHits() {
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
  tryBottleHit(t) {
    const enemies = this.level.enemies || [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || !e.alive) continue;
      if (!this.isColliding(t, e)) continue;
      this.hitEnemy(e, 1);
      playSound("hit");
      playSound("break");
      return true;
    }
    return false;
  }

  /**
   * Checks if boss intro should start.
   * @returns {void}
   */
  checkEndbossIntro() {
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
    if (this.coinInterval) clearInterval(this.coinInterval);
  }
}
