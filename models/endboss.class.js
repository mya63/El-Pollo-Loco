class Endboss extends MovableObject {
  hadFirstContact=false; isIntro=false; aggressive=false;
  height=400; width=250; y=55; speed=0.6;
  maxHp=9; hp=9; damage=30; alive=true;

  IMAGES_INTRO = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];
  IMAGES_WALK = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];
  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png'
  ];
  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png'
  ];

 constructor(){ super().loadImage(this.IMAGES_WALK[0]);
    this.loadImages(this.IMAGES_INTRO); this.loadImages(this.IMAGES_WALK); this.loadImages(this.IMAGES_ATTACK); this.loadImages(this.IMAGES_DEAD);
    this.x=2500;
 }

  takeDamage(d){
    if(!this.alive) return;
    this.hp -= d;
    if(this.hp <= 3 && !this.aggressive) this.becomeAggressive();
    if(this.hp<=0) this.die();
  }

  die(){
    this.alive=false; this.speed=0; this.deadTime = Date.now();
    clearInterval(this._moveInt); clearInterval(this._animInt);
    let i=0;
    this._deathInt = setInterval(()=>{
      if(i<this.IMAGES_DEAD.length){
        this.img = this.imageCache[this.IMAGES_DEAD[i]]; i++;
      } else {
        clearInterval(this._deathInt); showYouWon();
      }
    },200);
  }

  
  startIntro() {
    if (this.hadFirstContact) return;
    this.hadFirstContact = true;
    this.isIntro = true;
    clearInterval(this._moveInt);
    clearInterval(this._animInt);
    let cycles = 0,
      self = this;
    this._animInt = setInterval(function () {
      self.playAnimation(self.IMAGES_INTRO);
      cycles++;
      if (cycles > self.IMAGES_INTRO.length * 2) {
        clearInterval(self._animInt);
        self.isIntro = false;
        self.startWalk();
      }
    }, 140);
  }

  startWalk() {
    let self = this;
    this._moveInt = setInterval(function () {
      self.moveLeft();
    }, 1000 / 60);
    this._animInt = setInterval(function () {
      self.playAnimation(self.IMAGES_WALK);
    }, 180);
  }

  becomeAggressive(){
    this.aggressive = true;
    clearInterval(this._moveInt);
    clearInterval(this._animInt);
    this.speed = 1.2;
    this.startAttack();
  }

  startAttack(){
    let self = this;
    this._moveInt = setInterval(function(){
      self.moveLeft();
    },1000/60);
    this._animInt = setInterval(function(){
      self.playAnimation(self.IMAGES_ATTACK);
    },120);
  }
}
