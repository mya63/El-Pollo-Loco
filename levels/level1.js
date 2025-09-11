const enemySetup = { count: 9, startX: 900, minGap: 220, maxGap: 420 };

function buildChickenWave(cfg) {
  let list = [], x = cfg.startX;
  for (let i = 0; i < cfg.count; i++) {
    x += randBetween(cfg.minGap, cfg.maxGap);
    if (i % 3 === 0) {
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

let level1;
function initLevel() {
  const enemies = buildChickenWave(enemySetup);
  enemies.push(new Endboss()); 

  level1 = new Level(
    enemies,                   
    [ new Cloud() ],
    [
      new BackgroundObject('img/5_background/layers/air.png', -720),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),
      new BackgroundObject('img/5_background/layers/air.png', 0),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/air.png', 720),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
      new BackgroundObject('img/5_background/layers/air.png', 1440),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1440),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1440),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1440),
      new BackgroundObject('img/5_background/layers/air.png', 2160),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 2160),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 2160),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 2160)
    ]
  );
}
