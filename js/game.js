let canvas;
let world;
let keyboard = new Keyboard(); 

function showStart(){
  canvas = document.getElementById('canvas');
  const ov = document.getElementById('startOverlay');
  const ui = document.getElementById('startUI');
  if(canvas) canvas.style.visibility = 'hidden';
  if(ov) ov.style.display = 'block';
  if(ui) ui.style.display = 'grid';
  checkOrientation();                                // sofort prüfen
}

function init(){
  initLevel();
  world = new World(canvas, keyboard);
}

function startGame(){
  const ov = document.getElementById('startOverlay');
  const ui = document.getElementById('startUI');
  if(ov) ov.style.display = 'none';
  if(ui) ui.style.display = 'none';
  if(canvas) canvas.style.visibility = 'visible';
  init();                                            // Welt erstellen
  checkOrientation();                                // nach Start prüfen
}

function checkOrientation(){
  let rot = document.getElementById('rotateOverlay');
  let stg = document.getElementById('stage');
  let portrait = window.innerHeight > window.innerWidth; // kein fester px-Schwellenwert
  if(rot) rot.style.display = portrait ? 'flex' : 'none';
  if(stg) stg.style.visibility = portrait ? 'hidden' : 'visible';
}

function resetGame(){
  // Overlays aus, Canvas sichtbar
  let ids = ['gameOverOverlay','youWonOverlay','startOverlay'];
  for (let i=0;i<ids.length;i++){ let el=document.getElementById(ids[i]); if(el) el.style.display='none'; }
  if(canvas){ let ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
  location.reload();                                 // Seite neu laden = sauberer Reset
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

// Deutsch: Spieler hat verloren
function showGameOver(){
  document.getElementById('gameOverOverlay').style.display='block';
}

// Deutsch: Endboss ist tot
function showYouWon(){
  document.getElementById('youWonOverlay').style.display='block';
}

