let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById('canvas');
  initLevel();
  world = new World(canvas, keyboard);
}

function startGame(){
  const s = document.getElementById('startScreen');
  if(s) s.style.display = 'none';
  init();
}

function handleKeyDown(e){
  if(e.code==='ArrowRight') keyboard.RIGHT=true;
  if(e.code==='ArrowLeft')  keyboard.LEFT=true;
  if(e.code==='ArrowUp')    keyboard.UP=true;
  if(e.code==='ArrowDown')  keyboard.DOWN=true;
  if(e.code==='Space')      keyboard.SPACE=true;
  if(e.code==='KeyD')       keyboard.D=true;
}

function handleKeyUp(e){
  if(e.code==='ArrowRight') keyboard.RIGHT=false;
  if(e.code==='ArrowLeft')  keyboard.LEFT=false;
  if(e.code==='ArrowUp')    keyboard.UP=false;
  if(e.code==='ArrowDown')  keyboard.DOWN=false;
  if(e.code==='Space')      keyboard.SPACE=false;
  if(e.code==='KeyD')       keyboard.D=false;
}
