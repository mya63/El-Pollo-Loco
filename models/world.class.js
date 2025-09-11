class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; bossFocus = false;
  statusBar = new StatusBar();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.run();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    if (!this._animStarted) {
      this._animStarted = true;
      this.character.animate();
    }
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossIntro();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let b = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(b);
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      let e = this.level.enemies[i];
      if (this.character.isCollided(e)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    }
  }

  checkEndbossIntro() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      let e = this.level.enemies[i];
      if (e instanceof Endboss && !e.hadFirstContact) {
        if (this.character.x > e.x - 600) {
          e.startIntro();
          this.bossFocus = true;
          this.camera_x = -(e.x - 200);
          setTimeout(() => {
            this.bossFocus = false;
          }, 1600);
        }
      }
    }
  }

  clampCamera() {
    if (this.camera_x > 0) this.camera_x = 0;
    if (
      this.character &&
      this.level &&
      this.character.x > this.level.level_end_x
    ) {
      this.camera_x = -(this.level.level_end_x - 100);
    }
  }

// Deutscher Kommentar: Kamera nur in ganzen Pixeln bewegen
draw() {
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  const cam = Math.round(this.camera_x); // Snap auf Integer

  this.ctx.translate(cam,0);
  this.addObjectsToMap(this.level.backgroundObjects);
  this.ctx.translate(-cam,0);

  this.addToMap(this.statusBar);

  this.ctx.translate(cam,0);
  this.addToMap(this.character);
  this.addObjectsToMap(this.level.clouds);
  this.addObjectsToMap(this.level.enemies);
  this.addObjectsToMap(this.throwableObjects);
  this.ctx.translate(-cam,0);
  

  requestAnimationFrame(()=>this.draw());
}

  addObjectsToMap(objs) {
    for (let i = 0; i < objs.length; i++) this.addToMap(objs[i]);
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx); //mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }
  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }
}