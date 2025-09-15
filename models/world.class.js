class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; bossFocus = false;
  statusBar = new StatusBar();
  bottleBar = new StatusBarBottle();
  bossBar = new StatusBarEndboss();
  throwableObjects = [];
  bottleCount = 0;

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

  isColliding(a,b){ 
  return a.x+a.width>b.x && a.y+a.height>b.y &&
         a.x<b.x+b.width && a.y<b.y+b.height;
}

isStomp(c,e){
  // A stomp only counts when the player is falling and their feet
  // are above the enemy. This prevents running into enemies from
  // the side from defeating them instantly.
  const falling = c.speedY < 0;
  const above = (c.y + c.height) - e.y < 30;
  return falling && above;
}

  hitEnemy(e,d){
    if(!e || !e.alive) return;
    if(e.takeDamage) e.takeDamage(d);
    else { e.hp = (e.hp||1)-d; if(e.hp<=0 && e.die) e.die(); }
    if(e instanceof Endboss && this.bossBar){
      this.bossBar.setPercentage(Math.max(e.hp,0) / e.maxHp * 100);
    }
  }

hitPlayer(d){
  if(this.character && this.character.hit && !this.character.isHurt()){
    this.character.hit(d);
    if(this.statusBar){
      this.statusBar.setPercentage(this.character.energy / this.character.maxEnergy * 100);
    }
  }
}

run(){
  this.runInterval = setInterval(()=>{
    this.checkCollisions();
    this.checkBottleHits();
    this.checkBottlePickups();
    this.checkEndbossIntro();
    this.checkGameOver();
  }, 1000/60);
  this.throwInterval = setInterval(()=>{ this.checkThrowObjects(); }, 1000/60);
}

  checkThrowObjects() {
    if (this.keyboard.D && this.bottleCount > 0) {
      let dir = this.character.otherDirection ? -1 : 1;
      let b = new ThrowableObject(
        this.character.x + (dir === 1 ? this.character.width : -20),
        this.character.y + 100,
        dir
      );
      this.throwableObjects.push(b);
      this.bottleCount--;
      this.bottleBar.setPercentage(Math.min(this.bottleCount,5) * 20);
      this.keyboard.D = false;
    }
  }

  checkBottlePickups(){
    let bottles = this.level.bottles || [];
    for(let i=0;i<bottles.length;i++){
      let bo = bottles[i];
      if(!bo || bo.collected) continue;
      if(this.isColliding(this.character, bo)){
        bo.collect();
        this.bottleCount++;
        this.bottleBar.setPercentage(Math.min(this.bottleCount,5) * 20);
      }
    }
  }

  checkGameOver(){
    if(this.character.isDead() && !this.gameOverShown){
      this.gameOverShown = true;
      showGameOver();
    }
  }

checkCollisions(){ 
  let es=this.level.enemies; if(!es) return;
  for(let i=0;i<es.length;i++){
    let e=es[i]; if(!e||e.alive===false) continue;
      if(this.isColliding(this.character, e)){
      if(this.isStomp(this.character, e)){
        if(e instanceof Chicken || e instanceof SmallChicken){
          this.hitEnemy(e, e.hp||1);
        } else {
          this.hitEnemy(e,1);
        }
      } else {
        this.hitPlayer(e.damage||10);
      }
    }
  }
}

  checkBottleHits(){
  for(let i=0;i<this.throwableObjects.length;i++){
    let t=this.throwableObjects[i]; if(!t || t.broken) continue;
    for(let j=0;j<this.level.enemies.length;j++){
      let e=this.level.enemies[j]; if(!e || !e.alive) continue;
      if(this.isColliding(t,e)){ this.hitEnemy(e,1); t.broken=true; break; }
    }
  }
}


  checkEndbossIntro() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      let e = this.level.enemies[i];
      if (e instanceof Endboss && !e.hadFirstContact) {
        if (this.character.x > e.x - 600) {
          e.startIntro();
          this.bossBar.visible = true;
          this.bossBar.setPercentage(e.hp / e.maxHp * 100);
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


draw() {
  if(this.isStopped) return;
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  const cam = Math.round(this.camera_x);
  this.ctx.translate(cam,0);
  this.addObjectsToMap(this.level.backgroundObjects);
  this.ctx.translate(-cam,0);
  this.addToMap(this.statusBar);
  this.addToMap(this.bottleBar);
  if (this.bossBar.visible) {
    this.addToMap(this.bossBar);
  }
  this.ctx.translate(cam,0);
  this.addToMap(this.character);
  this.addObjectsToMap(this.level.clouds);
  this.addObjectsToMap(this.level.bottles);
  this.addObjectsToMap(this.level.enemies);
  this.addObjectsToMap(this.throwableObjects);
  this.ctx.translate(-cam,0);
  requestAnimationFrame(()=>this.draw());
}

addObjectsToMap(objs){
  const now = Date.now();
  for(let i=0;i<objs.length;i++){
    let o=objs[i];
    if(!o || o.broken || o.collected) continue;
    if(o.alive===false){
      if(!o.deadTime || now - o.deadTime > 1000) continue;
    }
    this.addToMap(o);
  }
}

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx); 
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

  stop(){
    this.isStopped = true;
    if(this.runInterval) clearInterval(this.runInterval);
    if(this.throwInterval) clearInterval(this.throwInterval);
  }
}