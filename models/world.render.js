/**
 * Rendering methods for World (split file).
 * @module world-render
 */

/**
 * Keeps camera within level bounds.
 * @returns {void}
 */
World.prototype.clampCamera = function () {
  if (this.camera_x > 0) this.camera_x = 0;
  if (!this.character || !this.level) return;
  if (this.character.x > this.level.level_end_x) {
    this.camera_x = -(this.level.level_end_x - 100);
  }
};

/**
 * Draw loop with requestAnimationFrame.
 * @returns {void}
 */
World.prototype.draw = function () {
  if (this.isStopped) return;
  this.clearCanvas();
  this.clampCamera();
  const cam = Math.round(this.camera_x);
  const view = this.getViewBounds(cam);
  this.ctx.translate(cam, 0);
  this.drawScene(cam, view);
  this.ctx.translate(-cam, 0);
  requestAnimationFrame(() => this.draw());
};

/**
 * Clears the canvas.
 * @returns {void}
 */
World.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Draws background, entities and UI.
 * @param {number} cam - Camera offset.
 * @param {{left:number,right:number}} view - View bounds.
 * @returns {void}
 */
World.prototype.drawScene = function (cam, view) {
  this.addObjectsToMap(this.level.backgroundObjects, view, true);
  this.drawEntities(view);
  this.ctx.translate(-cam, 0);
  this.drawUI();
  this.ctx.translate(cam, 0);
};

/**
 * Draws UI bars.
 * @returns {void}
 */
World.prototype.drawUI = function () {
  this.addToMap(this.statusBar);
  this.addToMap(this.bottleBar);
  this.addToMap(this.coinBar); // [MYA FIX]
  if (this.bossBar.visible) this.addToMap(this.bossBar);
};

/**
 * Draws character, items and enemies.
 * @param {{left:number,right:number}} view - View bounds.
 * @returns {void}
 */
World.prototype.drawEntities = function (view) {
  this.addToMap(this.character);
  this.addObjectsToMap(this.level.coins, view); // [MYA FIX]
  this.addObjectsToMap(this.level.clouds, view);
  this.addObjectsToMap(this.level.bottles, view);
  this.addObjectsToMap(this.level.enemies, view);
  this.addThrowableToMap(view); // [MYA NEW]
};

/**
 * Draws throwable objects from object-map.
 * @param {{left:number,right:number}} view - View bounds.
 * @returns {void}
 */
World.prototype.addThrowableToMap = function (view) { // [MYA NEW]
  for (let id in this.throwableObjects) {
    const o = this.throwableObjects[id];
    if (!o || o.broken) continue;
    if (!this.isInView(o, view)) continue;
    this.addToMap(o);
  }
};

/**
 * Adds objects to the map with culling.
 * @param {Array} objs - Object list.
 * @param {{left:number,right:number}} view - View bounds.
 * @param {boolean} [skipCull=false] - Skip view culling.
 * @returns {void}
 */
World.prototype.addObjectsToMap = function (objs, view, skipCull) {
  if (!Array.isArray(objs) || objs.length === 0) return;
  const now = Date.now();
  for (let i = 0; i < objs.length; i++) {
    const o = objs[i];
    if (!this.shouldDraw(o, now, view, !!skipCull)) continue;
    this.addToMap(o);
  }
};

/**
 * Checks if an object should be drawn.
 * @param {Object} o - Object.
 * @param {number} now - Timestamp.
 * @param {{left:number,right:number}} view - Bounds.
 * @param {boolean} skipCull - Skip culling.
 * @returns {boolean} True if drawable.
 */
World.prototype.shouldDraw = function (o, now, view, skipCull) {
  if (!o || o.broken || o.collected) return false;
  if (o.alive === false && (!o.deadTime || now - o.deadTime > 1000)) return false;
  if (!skipCull && !this.isInView(o, view)) return false;
  return true;
};

/**
 * Calculates view bounds for culling.
 * @param {number} cam - Camera offset.
 * @returns {{left:number,right:number}} Bounds.
 */
World.prototype.getViewBounds = function (cam) {
  const padding = this.canvas.width;
  const left = -cam - padding;
  const right = left + this.canvas.width + padding * 2;
  return { left, right };
};

/**
 * Checks if object is in view bounds.
 * @param {Object} obj - Object.
 * @param {{left:number,right:number}} view - Bounds.
 * @returns {boolean} True if in view.
 */
World.prototype.isInView = function (obj, view) {
  if (!view) return true;
  const x = obj.x || 0;
  const w = obj.width || 0;
  return x + w >= view.left && x <= view.right;
};

/**
 * Draws a single object (with flip if needed).
 * @param {MovableObject} mo - Movable object.
 * @returns {void}
 */
World.prototype.addToMap = function (mo) {
  if (mo.otherDirection) this.flipImage(mo);
  mo.draw(this.ctx);
  if (mo.otherDirection) this.flipImageBack(mo);
};

/**
 * Flips sprite horizontally.
 * @param {MovableObject} mo - Movable object.
 * @returns {void}
 */
World.prototype.flipImage = function (mo) {
  this.ctx.save();
  this.ctx.translate(mo.width, 0);
  this.ctx.scale(-1, 1);
  mo.x *= -1;
};

/**
 * Restores context after flipping.
 * @param {MovableObject} mo - Movable object.
 * @returns {void}
 */
World.prototype.flipImageBack = function (mo) {
  mo.x *= -1;
  this.ctx.restore();
};
