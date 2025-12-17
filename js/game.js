/**
 * Core game bootstrap and UI handlers.
 * Provides functions to start, reset and control the game.
 * @module game
 */
let canvas;
let world;
let keyboard = new Keyboard();

const audioStart = new Audio('audio/start.ogg');
const audioGame = new Audio('audio/game.mp3');
const audioWin = new Audio('audio/win.mp3');
const audioGameOver = new Audio('audio/gameover.mp3');
const throwSound = new Audio('audio/throw.mp3');

const sounds = { // [MYA CHANGE] Objekt statt Array
  start: audioStart,
  game: audioGame,
  win: audioWin,
  over: audioGameOver,
  throw: throwSound
};

function setDefaultVolumes() { // [MYA NEW] deutsche Kommentare, keine forEach
  for (let k in sounds) sounds[k].volume = 0.2;
}
setDefaultVolumes(); // [MYA FIX]
audioStart.loop = true; // [MYA FIX]
audioGame.loop = true;

/**
 * User interface state and control descriptions.
 * @type {{open: boolean, controls: Record<string, string>}}
 */
const UI = {
  open: false,
  controls: {
    '←': 'Gehen',
    '→': 'Gehen',
    SPACE: 'Springen',
    D: 'Tabasco werfen'
  }
};

let lastFocusedElement = null;
// [MYA NEW] Layout-Fullscreen für kleine Geräte (ohne Fullscreen-API)
function applyAutoLayoutFullscreen() {
  const small = window.matchMedia('(max-width: 1024px)').matches;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const lowH = window.matchMedia('(max-height: 700px)').matches;
  const on = (small && touch) || lowH;
  document.body.classList.toggle('play-mode', on);
}


/**
 * Displays the start screen and prepares the game.
 */
function showStart() {
  canvas = document.getElementById('canvas');
  if (canvas) canvas.style.visibility = 'hidden';
  document.getElementById('startOverlay').style.display = 'block';
  document.getElementById('startUI').style.display = 'grid';
  checkOrientation();
  audioStart.currentTime = 0;
  audioStart.play().catch(() => {});
  loadSoundState(); // [MYA NEW] Status aus localStorage übernehmen
  updateMuteButton();
  applyAutoLayoutFullscreen(); // [MYA CHANGE]

}

/**
 * Initializes the game world after level data is loaded.
 */
function init() {
  initLevel();
  world = new World(canvas, keyboard);
}

/**
 * Moves keyboard focus to the canvas element.
 */
function focusCanvas() {
  if (!canvas) canvas = document.getElementById('canvas');
  if (!canvas) return;
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0');
  canvas.focus();
}

/**
 * Blurs a given element and focuses the canvas.
 * @param {HTMLElement} [el] - Element to blur.
 * @returns {boolean} Always returns true.
 */
function blurToCanvas(el) {
  if (el && el.blur) el.blur();
  focusCanvas();
  return true;
}

/**
 * Hides the start screen and begins the game.
 */
function startGame() {
  document.body.classList.add('play-mode'); // [MYA CHANGE]
  document.getElementById('startOverlay').style.display = 'none';
  document.getElementById('startUI').style.display = 'none';
  if (canvas) canvas.style.visibility = 'visible';
  init();
  checkOrientation();
  focusCanvas();
  audioStart.pause();
  audioStart.currentTime = 0;
  audioGame.currentTime = 0;
  audioGame.play().catch(() => {});
}

document.onfullscreenchange = function () {
  let btn = document.getElementById('fsBtn');
  if (btn) btn.innerText = document.fullscreenElement ? '✖' : '⛶';
  focusCanvas();
};

/**
 * Toggles the game's fullscreen mode.
 */
function toggleFullscreen() {
  let el = document.getElementById('stage');
  if (!document.fullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
  setTimeout(focusCanvas, 200);
}

/**
 * Shows orientation overlay on mobile devices in portrait mode.
 */
function checkOrientation() {
  const portrait = window.matchMedia('(orientation: portrait)').matches;
  const overlay = document.getElementById('rotateOverlay');
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!overlay) return;
  overlay.style.display = portrait && isMobile ? 'flex' : 'none';
}

window.onorientationchange = checkOrientation; // [MYA CHANGE]

/**
 * Updates the mute button to reflect current sound state.
 */
function updateMuteButton() { // [MYA CHANGE]
  let btn = document.getElementById('muteBtn');
  if (btn) btn.innerText = sounds.start.muted ? '🔇' : '🔊';
}

/**
 * Toggles mute state for all game sounds.
 */
function toggleMute() { // [MYA CHANGE]
  const next = !sounds.start.muted;
  setAllSoundsMuted(next);
  localStorage.setItem('soundMuted', next);
  updateMuteButton();
  const btn = document.getElementById('muteBtn');
  if (btn && document.activeElement === btn) btn.blur();
  focusCanvas();
}
window.toggleMute = toggleMute;

/**
 * Sets a key value on the active keyboard.
 * @param {string} key - Key name.
 * @param {boolean} val - Whether the key is pressed.
 */
function setKey(key, val) {
  if (world && world.keyboard) world.keyboard[key] = val;
  else keyboard[key] = val;
}

/**
 * Activates a key from on-screen controls.
 * @param {string} key - Key name.
 * @param {HTMLElement} [el] - Control element.
 * @returns {boolean} Always returns false.
 */
function press(key, el) {
  if (el) el.setAttribute('data-active', '1');
  setKey(key, true);
  focusCanvas();
  return false;
}

/**
 * Deactivates a key from on-screen controls.
 * @param {string} key - Key name.
 * @param {HTMLElement} [el] - Control element.
 * @returns {boolean} Always returns false.
 */
function release(key, el) {
  if (el) el.removeAttribute('data-active');
  setKey(key, false);
  return false;
}

/**
 * Resets the game world and restarts the level.
 */
function resetGame() { // [MYA FIX]
  const ids = { a:'gameOverOverlay', b:'youWonOverlay', c:'startOverlay' };
  for (let k in ids) { let el = document.getElementById(ids[k]); if (el) el.style.display = 'none'; }
  let ui = document.getElementById('startUI'); if (ui) ui.style.display = 'none';
  if (world && world.stop) world.stop();
  keyboard = new Keyboard(); if (canvas) canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
  init(); checkOrientation(); focusCanvas();
  for (let s in sounds) { sounds[s].pause(); sounds[s].currentTime = 0; }
  audioGame.play().catch(() => {});
}

// expose function for inline button handlers
window.resetGame = resetGame;
window.openLegalModal = openLegalModal;
window.closeLegalModal = closeLegalModal;

/**

/**
 * Handles keyup events and updates the keyboard state.
 * @param {KeyboardEvent} e - Keyboard event.
 */
function handleKeyUp(e) {
  if (e.code === 'ArrowRight') keyboard.RIGHT = false;
  if (e.code === 'ArrowLeft') keyboard.LEFT = false;
  if (e.code === 'ArrowUp') keyboard.UP = false;
  if (e.code === 'ArrowDown') keyboard.DOWN = false;
  if (e.code === 'Space') keyboard.SPACE = false;
  if (e.code === 'KeyD') keyboard.D = false;
}

/**
 * Simulates a quick tap on a control for touch devices.
 * @param {string} action - Key action name.
 */
function uiTap(action) {
  if (!keyboard) return;
  setKey(action, true);
  setTimeout(() => setKey(action, false), 220);
}

/**
 * Renders the info list with available controls.
 */
function renderInfoList() {
  let box = document.getElementById('infoList');
  if (!box) return;
  box.innerHTML = Object.entries(UI.controls)
    .map(([k, v]) => `<p><span class="kbd">${k}</span> – ${v}</p>`)
    .join('');
}

/**
 * Displays the info overlay.
 */
function showInfo() { // ÄNDERN - MYA
  renderInfoList();
  let c = document.getElementById('infoCard');
  let s = document.getElementById('startUI');
  if (s && s.style.display !== 'none') s.style.display = 'none';
  if (!c) return;
  c.style.display = 'flex';
  c.setAttribute('aria-hidden', 'false');
  UI.open = true;
}

function hideInfo() { // ÄNDERN - MYA
  let c = document.getElementById('infoCard');
  let s = document.getElementById('startUI');
  let o = document.getElementById('startOverlay');
  if (c) c.style.display = 'none';
  if (c) c.setAttribute('aria-hidden', 'true');
  UI.open = false;
  if (o && o.style.display !== 'none' && s) s.style.display = 'grid';
  focusCanvas();
}

/**
 * Toggles the info overlay visibility.
 */
function toggleInfo() {
  UI.open ? hideInfo() : showInfo();
}

function openLegalModal() {
  const modal = document.getElementById('legalModal');
  if (!modal) return;
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const closeBtn = modal.querySelector('.legal-close');
  if (closeBtn) closeBtn.focus();
}

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  const shouldFocusCanvas = !lastFocusedElement || lastFocusedElement.id === 'canvas';
  if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  } else {
    const btn = document.getElementById('legalBtn');
    if (btn) btn.focus();
  }
  if (shouldFocusCanvas) focusCanvas();
  lastFocusedElement = null;
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeLegalModal(); // [MYA CHANGE]
  if (e.code === 'ArrowRight') keyboard.RIGHT = true;
  if (e.code === 'ArrowLeft') keyboard.LEFT = true;
  if (e.code === 'ArrowUp') keyboard.UP = true;
  if (e.code === 'ArrowDown') keyboard.DOWN = true;
  if (e.code === 'Space') keyboard.SPACE = true;
  if (e.code === 'KeyD') keyboard.D = true;
}

/**
 * Displays the game over screen and plays the lose sound.
 */
function showGameOver() {
  audioGame.pause();
  audioGame.currentTime = 0;
  audioGameOver.currentTime = 0;
  audioGameOver.play();
  document.getElementById('gameOverOverlay').style.display = 'block';
}

/**
 * Displays the win screen and plays the victory sound.
 */
function showYouWon() {
  audioGame.pause();
  audioGame.currentTime = 0;
  audioWin.currentTime = 0;
  audioWin.play();
  document.getElementById('youWonOverlay').style.display = 'block';
}


// [MYA NEW] Sound abspielen
function playThrowSound() { // [MYA CHANGE]
  if (sounds.throw.muted) return;
  sounds.throw.currentTime = 0;
  sounds.throw.play().catch(() => {});
}

/**
 * Lädt den Sound-Status aus dem LocalStorage
 */

/**
 * Wendet Mute auf alle Sounds an
 */

function loadSoundState() { // [MYA NEW]
  const muted = localStorage.getItem('soundMuted') === 'true';
  setAllSoundsMuted(muted);
  updateMuteButton();
}

function setAllSoundsMuted(muted) { // [MYA NEW]
  for (let k in sounds) sounds[k].muted = muted;
}
