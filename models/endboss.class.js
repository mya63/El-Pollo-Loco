class Endboss extends MovableObject {
  hadFirstContact=false; isIntro=false;
  height=400; width=250; y=55; speed=0.4;
  hp=5; damage=30; alive=true; 

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

 constructor(){ super().loadImage(this.IMAGES_WALK[0]);
    this.loadImages(this.IMAGES_INTRO); this.loadImages(this.IMAGES_WALK);
    this.x=2500;
  }

  takeDamage(d){ 
    if(!this.alive) return;
    this.hp -= d; if(this.hp<=0) this.die();
  }

  die(){ this.alive=false; this.speed=0; clearInterval(this._moveInt);
    clearInterval(this._animInt); }

  
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
}
