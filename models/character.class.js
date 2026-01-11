/**
 * Player character (Pepe).
 * Controls movement, camera and animations based on keyboard state.
 */
class Character extends MovableObject {
  height = 250;
  y = 180;
  speed = 10;

  IMAGES_WALKING = {
    a: 'img/2_character_pepe/2_walk/W-21.png',
    b: 'img/2_character_pepe/2_walk/W-22.png',
    c: 'img/2_character_pepe/2_walk/W-23.png',
    d: 'img/2_character_pepe/2_walk/W-24.png',
    e: 'img/2_character_pepe/2_walk/W-25.png',
    f: 'img/2_character_pepe/2_walk/W-26.png'
  };

  IMAGES_JUMPING = {
    a: 'img/2_character_pepe/3_jump/J-31.png',
    b: 'img/2_character_pepe/3_jump/J-32.png',
    c: 'img/2_character_pepe/3_jump/J-33.png',
    d: 'img/2_character_pepe/3_jump/J-34.png',
    e: 'img/2_character_pepe/3_jump/J-35.png',
    f: 'img/2_character_pepe/3_jump/J-36.png',
    g: 'img/2_character_pepe/3_jump/J-37.png',
    h: 'img/2_character_pepe/3_jump/J-38.png',
    i: 'img/2_character_pepe/3_jump/J-39.png'
  };

  IMAGES_DEAD = {
    a: 'img/2_character_pepe/5_dead/D-51.png',
    b: 'img/2_character_pepe/5_dead/D-52.png',
    c: 'img/2_character_pepe/5_dead/D-53.png',
    d: 'img/2_character_pepe/5_dead/D-54.png',
    e: 'img/2_character_pepe/5_dead/D-55.png',
    f: 'img/2_character_pepe/5_dead/D-56.png',
    g: 'img/2_character_pepe/5_dead/D-57.png'
  };

  IMAGES_HURT = {
    a: 'img/2_character_pepe/4_hurt/H-41.png',
    b: 'img/2_character_pepe/4_hurt/H-42.png',
    c: 'img/2_character_pepe/4_hurt/H-43.png'
  };

  IMAGES_IDLE = {
    a: 'img/2_character_pepe/1_idle/idle/I-1.png',
    b: 'img/2_character_pepe/1_idle/idle/I-2.png',
    c: 'img/2_character_pepe/1_idle/idle/I-3.png',
    d: 'img/2_character_pepe/1_idle/idle/I-4.png',
    e: 'img/2_character_pepe/1_idle/idle/I-5.png',
    f: 'img/2_character_pepe/1_idle/idle/I-6.png',
    g: 'img/2_character_pepe/1_idle/idle/I-7.png',
    h: 'img/2_character_pepe/1_idle/idle/I-8.png',
    i: 'img/2_character_pepe/1_idle/idle/I-9.png',
    j: 'img/2_character_pepe/1_idle/idle/I-10.png'
  };

  IMAGES_LONG_IDLE = {
    a: 'img/2_character_pepe/1_idle/long_idle/I-11.png',
    b: 'img/2_character_pepe/1_idle/long_idle/I-12.png',
    c: 'img/2_character_pepe/1_idle/long_idle/I-13.png',
    d: 'img/2_character_pepe/1_idle/long_idle/I-14.png',
    e: 'img/2_character_pepe/1_idle/long_idle/I-15.png',
    f: 'img/2_character_pepe/1_idle/long_idle/I-16.png',
    g: 'img/2_character_pepe/1_idle/long_idle/I-17.png',
    h: 'img/2_character_pepe/1_idle/long_idle/I-18.png',
    i: 'img/2_character_pepe/1_idle/long_idle/I-19.png',
    j: 'img/2_character_pepe/1_idle/long_idle/I-20.png'
  };

  world;
  lastMoveTime = 0;
  energy = 100;
  maxEnergy = 100;

  /**
   * Creates the character and loads all animation images.
   */
  constructor() {
    super();
    this.loadStartImage();
    this.loadAllAnimations();
    this.applyGravity();
  }

  /**
   * Loads the default start image.
   * @returns {void}
   */
  loadStartImage() {
    this.loadImage(this.IMAGES_WALKING.a);
  }

  /**
   * Loads all animation image sets.
   * @returns {void}
   */
  loadAllAnimations() {
    this.loadImageSet(this.IMAGES_WALKING);
    this.loadImageSet(this.IMAGES_JUMPING);
    this.loadImageSet(this.IMAGES_DEAD);
    this.loadImageSet(this.IMAGES_HURT);
    this.loadImageSet(this.IMAGES_IDLE);
    this.loadImageSet(this.IMAGES_LONG_IDLE);
  }

  /**
   * Loads an image set stored as an object map.
   * @param {Object} set - Image map.
   * @returns {void}
   */
  loadImageSet(set) {
    for (let k in set) this.loadImages([set[k]]);
  }

  /**
   * Starts movement input loop and animation cycle.
   * @returns {void}
   */
  animate() {
    this.startMovement();
    this.startAnimationCycle();
  }

  /**
   * Handles movement loop at ~60 FPS.
   * @returns {void}
   */
  startMovement() {
    setInterval(() => {
      const moving = this.handleInput();
      if (moving) this.lastMoveTime = Date.now();
      this.updateCamera();
    }, 1000 / 60);
  }

  /**
   * Reads keyboard input and triggers movements.
   * @returns {boolean} True if any movement happened.
   */
  handleInput() {
    let moving = false;
    if (this.handleRight()) moving = true;
    if (this.handleLeft()) moving = true;
    if (this.handleJump()) moving = true;
    return moving;
  }

  /**
   * Moves the character to the right when allowed.
   * @returns {boolean} True if moved.
   */
  handleRight() {
    if (!this.world.keyboard.RIGHT) return false;
    if (this.x >= this.world.level.level_end_x) return false;
    this.moveRight();
    this.otherDirection = false;
    return true;
  }

  /**
   * Moves the character to the left when allowed.
   * @returns {boolean} True if moved.
   */
  handleLeft() {
    if (!this.world.keyboard.LEFT) return false;
    if (this.x <= 0) return false;
    this.moveLeft();
    this.otherDirection = true;
    return true;
  }

  /**
   * Triggers a jump when SPACE is pressed and character is on ground.
   * @returns {boolean} True if jumped.
   */
  handleJump() {
    if (!this.world.keyboard.SPACE) return false;
    if (this.isAboveGround()) return false;
    this.jump();
    return true;
  }

  /**
   * Updates camera position if boss intro is not locking the camera.
   * @returns {void}
   */
  updateCamera() {
    if (!this.world || this.world.bossFocus) return;
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Starts the animation loop.
   * @returns {void}
   */
  startAnimationCycle() {
    setInterval(() => {
      this.playCurrentAnimation();
    }, 100);
  }

  /**
   * Selects and plays the correct animation based on state.
   * @returns {void}
   */
  playCurrentAnimation() {
    if (this.isDead()) return this.playImageSet(this.IMAGES_DEAD);
    if (this.isHurt()) return this.playImageSet(this.IMAGES_HURT);
    if (this.isAboveGround()) return this.playImageSet(this.IMAGES_JUMPING);
    if (this.isWalking()) return this.playImageSet(this.IMAGES_WALKING);
    this.playIdleAnimation();
  }

  /**
   * Checks if character is walking (left/right pressed).
   * @returns {boolean} True if walking.
   */
  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Plays idle or long-idle based on last movement time.
   * @returns {void}
   */
  playIdleAnimation() {
    const idleTime = Date.now() - this.lastMoveTime;
    if (idleTime > 5000) this.playImageSet(this.IMAGES_LONG_IDLE);
    else this.playImageSet(this.IMAGES_IDLE);
  }

  /**
   * Plays an animation set stored as object (converted to array).
   * @param {Object} set - Image map.
   * @returns {void}
   */
  playImageSet(set) {
    const arr = this.toArray(set);
    this.playAnimation(arr);
  }

  /**
   * Converts an object map to an array.
   * @param {Object} set - Image map.
   * @returns {Array<string>} Array of image paths.
   */
  toArray(set) {
    const arr = [];
    for (let k in set) arr.push(set[k]);
    return arr;
  }
}
