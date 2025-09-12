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

// Deutsch: Fokus sicher auf Canvas setzen
function focusCanvas(){
  let c = document.getElementById('canvas');
  if(!c) return;
  if(!c.hasAttribute('tabindex')) c.setAttribute('tabindex','0');
  c.focus();
}

// Deutsch: Button-Fokus sofort entfernen und Canvas fokussieren
function blurToCanvas(el){
  if(el && el.blur) el.blur();
  focusCanvas();
  return true; // erlaubt den Klick normal weiterlaufen
}


function startGame(){
  let ov=document.getElementById('startOverlay');
  let ui=document.getElementById('startUI');
  if(ov) ov.style.display='none';
  if(ui) ui.style.display='none';
  if(canvas) canvas.style.visibility='visible';
  init();
  checkOrientation();
  focusCanvas();                    // ← neu
}

document.onfullscreenchange = function(){
  let btn=document.getElementById('fsBtn');
  btn.innerText=document.fullscreenElement ? '✖' : '⛶';
  focusCanvas();                    // ← Fokus nach Event sichern
};

function toggleFullscreen(){
  let el=document.getElementById('stage');
  if(!document.fullscreenElement){
    if(el.requestFullscreen) el.requestFullscreen();
    else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if(el.msRequestFullscreen) el.msRequestFullscreen();
  } else {
    if(document.exitFullscreen) document.exitFullscreen();
    else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
  setTimeout(focusCanvas,200);      // ← nach Wechsel erneut fokussieren
}

function checkOrientation(){
  let rot = document.getElementById('rotateOverlay');
  let stg = document.getElementById('stage');
  let portrait = window.innerHeight > window.innerWidth; // kein fester px-Schwellenwert
  if(rot) rot.style.display = portrait ? 'flex' : 'none';
  if(stg) stg.style.visibility = portrait ? 'hidden' : 'visible';
}

function resetGame(){
  let ids=['gameOverOverlay','youWonOverlay','startOverlay'];
  for(let i=0;i<ids.length;i++){ let el=document.getElementById(ids[i]); if(el) el.style.display='none'; }
  if(canvas){ let ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
  location.reload();                // sauberer Reset
  // focusCanvas() nach reload nicht nötig
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
  let c=document.getElementById('infoCard');
  if(c){ c.style.display='flex'; c.ariaHidden='false'; }
  renderInfolist();
}

function hideInfo(){
  let c=document.getElementById('infoCard');
  if(c){ c.style.display='none'; c.ariaHidden='true'; }
  focusCanvas();                    // ← neu
}

function toggleInfo(){
  let c=document.getElementById('infoCard');
  if(c && c.style.display==='flex'){ hideInfo(); } else { showInfo(); }
  focusCanvas();                    // ← neu
}

// Deutsch: Spieler hat verloren
function showGameOver(){
  document.getElementById('gameOverOverlay').style.display='block';
}

// Deutsch: Endboss ist tot
function showYouWon(){
  document.getElementById('youWonOverlay').style.display='block';
}



