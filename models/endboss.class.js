/**
 * Endboss enemy (boss chicken).
 * Controls intro, walking, attacking, damage and death sequence.
 */
class Endboss extends MovableObject {
  hadFirstContact = false;
  isIntro = false;
  aggressive = false;

  height = 400;
  width = 250;
  y = 55;
  speed = 0.6;

  maxHp = 9;
  hp = 9;
  damage = 30;
  alive = true;

  IMAGES_INTRO = {
    a: 'img/4_enemie_boss_chicken/2_alert/G5.png',
    b: 'img/4_enemie_boss_chicken/2_alert/G6.png',
    c: 'img/4_enemie_boss_chicken/2_alert/G7.png',
    d: 'img/4_enemie_boss_chicken/2_alert/G8.png',
    e: 'img/4_enemie_boss_chicken/2_alert/G9.png',
    f: 'img/4_enemie_boss_chicken/2_alert/G10.png',
    g: 'img/4_enemie_boss_chicken/2_alert/G11.png',
    h: 'img/4_enemie_boss_chicken/2_alert/G12.png'
  }; 

  IMAGES_WALK = {
    a: 'img/4_enemie_boss_chicken/1_walk/G1.png',
    b: 'img/4_enemie_boss_chicken/1_walk/G2.png',
    c: 'img/4_enemie_boss_chicken/1_walk/G3.png',
    d: 'img/4_enemie_boss_chicken/1_walk/G4.png'
  }; 

  IMAGES_ATTACK = {
    a: 'img/4_enemie_boss_chicken/3_attack/G13.png',
    b: 'img/4_enemie_boss_chicken/3_attack/G14.png',
    c: 'img/4_enemie_boss_chicken/3_attack/G15.png',
    d: 'img/4_enemie_boss_chicken/3_attack/G16.png',
    e: 'img/4_enemie_boss_chicken/3_attack/G17.png',
    f: 'img/4_enemie_boss_chicken/3_attack/G18.png',
    g: 'img/4_enemie_boss_chicken/3_attack/G19.png',
    h: 'img/4_enemie_boss_chicken/3_attack/G20.png'
  }; 

  IMAGES_DEAD = {
    a: 'img/4_enemie_boss_chicken/5_dead/G24.png',
    b: 'img/4_enemie_boss_chicken/5_dead/G25.png',
    c: 'img/4_enemie_boss_chicken/5_dead/G26.png'
  }; 

  /**
   * Creates the endboss and loads all animation images.
   */
  constructor() {
    super();
    this.loadStartImage();
    this.loadAllAnimations();
    this.x = 2500;
  }

  /**
   * Loads the default start image.
   * @returns {void}
   */
  loadStartImage() { 
    this.loadImage(this.IMAGES_WALK.a);
  }

  /**
   * Loads all animation image sets.
   * @returns {void}
   */
  loadAllAnimations() { 
    this.loadImageSet(this.IMAGES_INTRO);
    this.loadImageSet(this.IMAGES_WALK);
    this.loadImageSet(this.IMAGES_ATTACK);
    this.loadImageSet(this.IMAGES_DEAD);
  }

  /**
   * Loads an image set stored as an object.
   * @param {Object} set - Image map.
   * @returns {void}
   */
  loadImageSet(set) { 
    for (let k in set) this.loadImages([set[k]]);
  }

  /**
   * Converts an image map to an array for playAnimation().
   * @param {Object} set - Image map.
   * @returns {Array<string>} Array of image paths.
   */
  toArray(set) { 
    const arr = [];
    for (let k in set) arr.push(set[k]);
    return arr;
  }

  /**
   * Takes damage and triggers aggression/death states.
   * @param {number} d - Damage amount.
   * @returns {void}
   */
  takeDamage(d) {
    if (!this.alive) return;
    this.hp -= d;
    if (this.hp <= 3 && !this.aggressive) this.becomeAggressive();
    if (this.hp <= 0) this.die();
  }

  /**
   * Starts the death animation and ends the game (win).
   * @returns {void}
   */
  die() {
    this.alive = false;
    this.speed = 0;
    this.deadTime = Date.now();
    this.stopBossIntervals();
    this.playDeathSequence();
  }

  /**
   * Clears movement/animation intervals safely.
   * @returns {void}
   */
  stopBossIntervals() { 
    if (this._moveInt) clearInterval(this._moveInt);
    if (this._animInt) clearInterval(this._animInt);
    if (this._deathInt) clearInterval(this._deathInt);
  }

  /**
   * Plays the death frames and triggers win screen at the end.
   * @returns {void}
   */
  playDeathSequence() {
    const frames = this.toArray(this.IMAGES_DEAD);
    let i = 0;
    this._deathInt = setInterval(() => {
      if (i < frames.length) { this.img = this.imageCache[frames[i]]; i++; }
      else { clearInterval(this._deathInt); showYouWon(); }
    }, 200);
  }

  /**
   * Starts the intro animation once when player reaches the boss.
   * @returns {void}
   */
  startIntro() {
    if (this.hadFirstContact) return;
    this.hadFirstContact = true;
    this.isIntro = true;
    this.stopBossIntervals();
    this.runIntroAnimation();
  }

  /**
   * Runs the intro animation cycles and then starts walking.
   * @returns {void}
   */
  runIntroAnimation() { 
    const frames = this.toArray(this.IMAGES_INTRO);
    let cycles = 0;
    this._animInt = setInterval(() => {
      this.playAnimation(frames);
      cycles++;
      if (cycles > frames.length * 2) { clearInterval(this._animInt); this.isIntro = false; this.startWalk(); }
    }, 140);
  }

  /**
   * Starts walking movement and walk animation.
   * @returns {void}
   */
  startWalk() {
    const frames = this.toArray(this.IMAGES_WALK);
    this._moveInt = setInterval(() => { this.moveLeft(); }, 1000 / 60);
    this._animInt = setInterval(() => { this.playAnimation(frames); }, 180);
  }

  /**
   * Switches boss to aggressive mode (faster + attack).
   * @returns {void}
   */
  becomeAggressive() {
    this.aggressive = true;
    this.stopBossIntervals();
    this.speed = 1.2;
    this.startAttack();
  }

  /**
   * Starts attack movement and attack animation.
   * @returns {void}
   */
  startAttack() {
    const frames = this.toArray(this.IMAGES_ATTACK);
    this._moveInt = setInterval(() => { this.moveLeft(); }, 1000 / 60);
    this._animInt = setInterval(() => { this.playAnimation(frames); }, 120);
  }
}
