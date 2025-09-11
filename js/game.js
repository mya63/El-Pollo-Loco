let canvas;
let world;
let keyboard = new Keyboard(); 

function showStart(){
  canvas = document.getElementById('canvas');
  const ov = document.getElementById('startOverlay');
  if(canvas) canvas.style.visibility = 'hidden';
  if(ov) ov.style.display = 'block';
}

function init(){
  initLevel();
  world = new World(canvas, keyboard);
}

function startGame(){
  const ov = document.getElementById('startOverlay');
  if(ov) ov.style.display = 'none';
  if(canvas) canvas.style.visibility = 'visible';
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

const UI = { open:false, controls:{ '← / →':'Gehen', 'Leertaste':'Springen', 'D':'Tabasco werfen' } };

function renderInfoList(){
  const box = document.getElementById('infoList'); let html='';
  for (let k in UI.controls){
    html += `<p><span class="kbd">${k}</span> – ${UI.controls[k]}</p>`;
  }
  box.innerHTML = html;
}

function showInfo(){
  renderInfoList();
  const c = document.getElementById('infoCard'); c.style.display='flex'; UI.open=true;
}

function hideInfo(){
  const c = document.getElementById('infoCard'); c.style.display='none'; UI.open=false;
}

function toggleInfo(){
  if(UI.open){ hideInfo(); } else { showInfo(); }
}

