let canvas;
let world;
let keyboard = new Keyboard();

const UI = {
  open: false,
  controls: {
    '←': 'Gehen',
    '→': 'Gehen',
    'SPACE': 'Springen',
    'D': 'Tabasco werfen'
  }
};

function showStart(){
  canvas = document.getElementById('canvas');
  if(canvas) canvas.style.visibility = 'hidden';
  document.getElementById('startOverlay').style.display = 'block';
  document.getElementById('startUI').style.display = 'grid';
  checkOrientation();
}

function init(){
  initLevel();
  world = new World(canvas, keyboard);
}

function focusCanvas(){
  if(!canvas) canvas = document.getElementById('canvas');
  if(!canvas) return;
  if(!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex','0');
  canvas.focus();
}

function blurToCanvas(el){ if(el && el.blur) el.blur(); focusCanvas(); return true; }

function startGame(){
  document.getElementById('startOverlay').style.display='none';
  document.getElementById('startUI').style.display='none';
  if(canvas) canvas.style.visibility='visible';
  init();
  checkOrientation();
  focusCanvas();
}

document.onfullscreenchange = function(){
  let btn=document.getElementById('fsBtn');
  if(btn) btn.innerText=document.fullscreenElement ? '✖' : '⛶';
  focusCanvas();
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
  setTimeout(focusCanvas,200);
}

function checkOrientation(){
  const portrait = window.matchMedia('(orientation: portrait)').matches;
  const overlay = document.getElementById('rotateOverlay');
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if(!overlay) return;
  overlay.style.display = portrait && isMobile ? 'flex' : 'none';
}

window.addEventListener('orientationchange', checkOrientation);

function setKey(key, val){
  if(world && world.keyboard) world.keyboard[key] = val;
  else keyboard[key] = val;
}

function press(key, el){ if(el) el.setAttribute('data-active','1'); setKey(key,true); focusCanvas(); return false; }
function release(key, el){ if(el) el.removeAttribute('data-active'); setKey(key,false); return false; }

function resetGame(){
  ['gameOverOverlay','youWonOverlay','startOverlay'].forEach(id=>{ let el=document.getElementById(id); if(el) el.style.display='none'; });
  if(canvas){ let ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
  location.reload();
}

// expose function for inline button handlers
window.resetGame = resetGame;

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

function uiTap(action){
  if(!keyboard) return;
  setKey(action,true);
  setTimeout(()=>setKey(action,false),220);
}

function renderInfoList(){
  let box=document.getElementById('infoList'); if(!box) return;
  box.innerHTML = Object.entries(UI.controls).map(([k,v])=>`<p><span class="kbd">${k}</span> – ${v}</p>`).join('');
}
function showInfo(){ renderInfoList(); let c=document.getElementById('infoCard'); if(c){ c.style.display='flex'; c.ariaHidden='false'; UI.open=true; }}
function hideInfo(){ let c=document.getElementById('infoCard'); if(c){ c.style.display='none'; c.ariaHidden='true'; UI.open=false; focusCanvas(); }}
function toggleInfo(){ UI.open?hideInfo():showInfo(); }

function showGameOver(){ document.getElementById('gameOverOverlay').style.display='block'; }
function showYouWon(){ document.getElementById('youWonOverlay').style.display='block'; }
