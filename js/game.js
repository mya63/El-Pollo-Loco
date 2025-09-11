let canvas;
let world;
let keyboard = new Keyboard(); 

function showStart(){ // Startscreen anzeigen
  canvas = document.getElementById('canvas');           // Canvas holen
  const ov = document.getElementById('startOverlay');   // Overlay holen
  const ui = document.getElementById('startUI');        // UI holen
  if(canvas) canvas.style.visibility = 'hidden';        // Canvas verstecken
  if(ov) ov.style.display = 'block';                    // Bild zeigen
  if(ui) ui.style.display = 'grid';                     // Button zeigen
}
function init(){
  initLevel();
  world = new World(canvas, keyboard);
}

function startGame(){ // Spiel starten
  const ov = document.getElementById('startOverlay');   // Overlay holen
  const ui = document.getElementById('startUI');        // UI holen
  if(ov) ov.style.display = 'none';                     // Bild aus
  if(ui) ui.style.display = 'none';                     // Button aus
  if(canvas) canvas.style.visibility = 'visible';       // Canvas an
  init();                                               // Level + World
}
function resetGame(){ 
  let c = document.getElementById('canvas');            
  let ctx = c.getContext('2d');                          
  ctx.clearRect(0,0,c.width,c.height);                   
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

