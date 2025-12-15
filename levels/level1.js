const bgConfig = {
  startX: -720, endX: 4320, step: 720,
  layers: {
    air: 'img/5_background/layers/air.png',
    third: { one: 'img/5_background/layers/3_third_layer/1.png', two: 'img/5_background/layers/3_third_layer/2.png' },
    second:{ one: 'img/5_background/layers/2_second_layer/1.png', two:'img/5_background/layers/2_second_layer/2.png' },
    first: { one: 'img/5_background/layers/1_first_layer/1.png',  two:'img/5_background/layers/1_first_layer/2.png' }
  }
};

const enemySetup = { count: 20, startX: 900, minGap: 220, maxGap: 420 };

 

function buildChickenWave(cfg) {
  let list = [], x = cfg.startX;
  for (let i = 0; i < cfg.count; i++) {
    x += randBetween(cfg.minGap, cfg.maxGap);
    if (Math.random() < 0.5) {
      list.push(new SmallChicken(x));
    } else {
      list.push(new Chicken(x));
    }
  }
  return list;
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildBottles(count, startX, endX){
  let list = [];
  for(let i=0;i<count;i++){
    let x = randBetween(startX, endX);
    list.push(new Bottle(x));
  }
  return list;
}

function spawnEndbossAt(x) {
  let e = new Endboss();
  e.x = x;
  return e;
}
function initLevel() {
  const enemies = buildChickenWave(enemySetup);
  enemies.push(spawnEndbossAt(4000));

  const backgrounds = buildBackground(bgConfig);
  const bottles = buildBottles(60, 500, 3500);
  const coins = buildCoins(); // [MYA NEU]

  level1 = new Level(enemies, [ new Cloud() ], backgrounds, bottles);
  level1.coins = coins; // [MYA NEU]
  level1.level_end_x = bgConfig.endX;
}


function buildBackground(cfg) {
  let list = [], t = 0;
  for (let x = cfg.startX; x <= cfg.endX; x += cfg.step) {
    list.push(new BackgroundObject(cfg.layers.air, x));
    let p3 = (t % 2 === 0) ? cfg.layers.third.two  : cfg.layers.third.one;
    let p2 = (t % 2 === 0) ? cfg.layers.second.two : cfg.layers.second.one;
    let p1 = (t % 2 === 0) ? cfg.layers.first.two  : cfg.layers.first.one;
    list.push(new BackgroundObject(p3, x));
    list.push(new BackgroundObject(p2, x));
    list.push(new BackgroundObject(p1, x));
    t++;
  }
  return list;
}

// [MYA NEU] Coins spawnen (einfach, kontrolliert)
function buildCoins() {
  let list = [];
  for (let i = 0; i < 25; i++) {
    let x = randBetween(300, 3800);
    let y = randBetween(120, 300);
    list.push(new Coin(x, y));
  }
  return list;
}

