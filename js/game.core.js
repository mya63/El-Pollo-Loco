/**
 * Core game bootstrap and global UI handlers.
 * Split file to keep under 400 lines.
 * @module game-core
 */

let canvas;
let world;
let keyboard = new Keyboard();
let isGameRunning = false; // [MYA NEW] Spielstatus

const audioStart = new Audio('audio/start.ogg');
const audioGame = new Audio('audio/game.mp3');
const audioWin = new Audio('audio/win.mp3');
const audioGameOver = new Audio('audio/gameover.mp3');
const throwSound = new Audio('audio/throw.mp3');

const sounds = {
  // [MYA CHANGE] Objekt statt Array
  start: audioStart,
  game: audioGame,
  win: audioWin,
  over: audioGameOver,
  throw: throwSound
};

// [MYA NEW] Extra-Sounds (Feedback Lehrer)
const audioHit = new Audio('audio/hit.mp3'); // Flasche trifft Gegner
const audioHurt = new Audio('audio/hurt.mp3'); // Spieler bekommt Schaden
const audioPickup = new Audio('audio/pickup.mp3'); // Coin/Flasche eingesammelt

// [MYA NEW] Sounds erweitern (Objekt bleibt)
sounds.hit = audioHit;
sounds.hurt = audioHurt;
sounds.pickup = audioPickup;

/**
 * Plays a sound safely (restarts sound).
 * @param {string} key - Sound key from sounds object.
 * @returns {void}
 */
function playSound(key, maxMs = 0) {
  // [MYA CHANGE]
  if (!sounds[key] || sounds[key].muted) return;
  if (sounds[key].paused === false && key === 'hurt') return;
  const s = sounds[key];
  s.currentTime = 0;
  s.play().catch(() => {});
  if (maxMs > 0) setTimeout(() => s.pause(), maxMs);
}

/**
 * Plays the throw sound (used by World).
 * @returns {void}
 */
function playThrowSound() {
  // [MYA NEW]
  playSound('throw');
}
window.playThrowSound = playThrowSound; // [MYA NEW]
window.playSound = playSound; // [MYA NEW]

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

/**
 * Sets default volume for all sounds.
 * @returns {void}
 */
function setDefaultVolumes() {
  // deutsche Kommentare, keine forEach
  for (let k in sounds) sounds[k].volume = 0.2;
}
setDefaultVolumes(); // [MYA FIX]

/**
 * Applies a CSS-based "fullscreen" layout on small/touch devices.
 * Uses media queries instead of the Fullscreen API.
 * @returns {void}
 */
function applyAutoLayoutFullscreen() {
  const small = window.matchMedia('(max-width: 1024px)').matches;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const lowH = window.matchMedia('(max-height: 700px)').matches;
  const on = (small && touch) || lowH;
  document.body.classList.toggle('play-mode', on);
}

/**
 * Displays the start screen and prepares the game.
 * @returns {void}
 */
function showStart() {
  canvas = document.getElementById('canvas');
  if (canvas) canvas.style.visibility = 'hidden';
  document.getElementById('startOverlay').style.display = 'block';
  document.getElementById('startUI').style.display = 'grid';
  checkOrientation();
  audioStart.currentTime = 0;
  audioStart.play().catch(() => {});
  loadSoundState();
  updateMuteButton();
  applyAutoLayoutFullscreen();
}

/**
 * Initializes the game world after level data is loaded.
 * @returns {void}
 */
function init() {
  initLevel();
  world = new World(canvas, keyboard);
}

/**
 * Moves keyboard focus to the canvas element.
 * @returns {void}
 */
function focusCanvas() {
  if (!canvas) canvas = document.getElementById('canvas');
  if (!canvas) return;
  if (!canvas.hasAttribute('tabindex'))
    canvas.setAttribute('tabindex', '0');
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
 * @returns {void}
 */
function startGame() {
  isGameRunning = true; // [MYA NEW]
  applyAutoLayoutFullscreen(); // [MYA CHANGE] play-mode nur wenn mobile/touch/lowH
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

/**
 * Updates fullscreen button state on fullscreen change.
 * @returns {void}
 */
document.onfullscreenchange = function () {
  let btn = document.getElementById('fsBtn');
  if (btn) btn.innerText = document.fullscreenElement ? '✖' : '⛶';
  focusCanvas();
};

/**
 * Toggles the game's fullscreen mode.
 * @returns {void}
 */
function toggleFullscreen() {
  let el = document.getElementById('stage');
  if (!document.fullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen)
      document.webkitExitFullscreen();
  }
  setTimeout(focusCanvas, 200);
}

/**
 * Shows orientation overlay on mobile devices in portrait mode.
 * @returns {void}
 */
function checkOrientation() {
  const portrait = window.matchMedia(
    '(orientation: portrait)'
  ).matches;
  const overlay = document.getElementById('rotateOverlay');
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );
  if (!overlay) return;
  overlay.style.display = portrait && isMobile ? 'flex' : 'none';
}

/**
 * Runs orientation check on device orientation change.
 * @returns {void}
 */
window.onorientationchange = function () {
  checkOrientation();
};

/**
 * Updates the mute button to reflect current sound state.
 * @returns {void}
 */
function updateMuteButton() {
  let btn = document.getElementById('muteBtn');
  if (btn) btn.innerText = sounds.start.muted ? '🔇' : '🔊';
}

/**
 * Applies the mute state to all sounds.
 * @param {boolean} muted - True to mute all sounds.
 * @returns {void}
 */
function setAllSoundsMuted(muted) {
  for (let k in sounds) sounds[k].muted = muted;
}

/**
 * Loads sound mute state from localStorage and applies it.
 * @returns {void}
 */
function loadSoundState() {
  const muted = localStorage.getItem('soundMuted') === 'true';
  setAllSoundsMuted(muted);
  updateMuteButton();
}

/**
 * Toggles mute state for all game sounds.
 * @returns {void}
 */
function toggleMute() {
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
 * @returns {void}
 */
function setKey(key, val) {
  if (world && world.keyboard) world.keyboard[key] = val;
  else keyboard[key] = val;
}

function stopAllSoundsExcept(key) {
  // [MYA NEW]
  for (let k in sounds) {
    if (k === key) continue;
    sounds[k].pause();
    sounds[k].currentTime = 0;
  }
}
window.stopAllSoundsExcept = stopAllSoundsExcept; // [MYA NEW]

/**
 * Activates a key from on-screen controls.
 * @param {string} key - Key name.
 * @param {HTMLElement} [el] - Control element.
 * @returns {boolean} Always returns false.
 */
function press(key, el) {
  if (el) el.setAttribute('data-active', '1');
  if (key === 'D') triggerThrowOnce(); // [MYA NEW]
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
  if (key === 'D') releaseThrowLock(); // [MYA FIX]
  else setKey(key, false);             // [MYA FIX]
  return false;
}

/**
 * Handles keyup events and updates the keyboard state.
 * @param {KeyboardEvent} e - Keyboard event.
 * @returns {void}
 */
function handleKeyUp(e) {
  if (e.code === 'ArrowRight') keyboard.RIGHT = false;
  if (e.code === 'ArrowLeft') keyboard.LEFT = false;
  if (e.code === 'ArrowUp') keyboard.UP = false;
  if (e.code === 'ArrowDown') keyboard.DOWN = false;
  if (e.code === 'Space') keyboard.SPACE = false;

  if (e.code === 'KeyD') {
    releaseThrowLock();                 // [MYA FIX] D_LOCK wird frei
    if (world) world.throwLock = false; // [MYA FIX] World-Lock frei
  }
}
function triggerThrowOnce() {
  // [MYA NEW] 1 Flasche pro Klick
  if (keyboard.D_LOCK) return;
  keyboard.D_ONCE = true;
  keyboard.D_LOCK = true;
}

function releaseThrowLock() {
  // [MYA NEW] erst nach Loslassen wieder erlauben
  keyboard.D = false;
  keyboard.D_ONCE = false;
  keyboard.D_LOCK = false;
}

/**
 * Handles keydown events and updates keyboard state.
 * @param {KeyboardEvent} e - Keyboard event.
 * @returns {void}
 */
function handleKeyDown(e) {
  if (e.key === 'Escape' && typeof closeLegalModal === 'function')
    closeLegalModal();
  if (e.code === 'ArrowRight') keyboard.RIGHT = true;
  if (e.code === 'ArrowLeft') keyboard.LEFT = true;
  if (e.code === 'ArrowUp') keyboard.UP = true;
  if (e.code === 'ArrowDown') keyboard.DOWN = true;
  if (e.code === 'Space') keyboard.SPACE = true;
  if (e.code === 'KeyD') {
    keyboard.D = true;
    triggerThrowOnce();
  } // [MYA CHANGE]
}

/**
 * Resets the game world and restarts the level.
 * @returns {void}
 */
function resetGame() {
  isGameRunning = false; // [MYA NEW]
  document.body.classList.remove('play-mode'); // [MYA NEW] Desktop wieder normal
  const ids = {
    a: 'gameOverOverlay',
    b: 'youWonOverlay',
    c: 'startOverlay'
  };
  for (let k in ids) {
    let el = document.getElementById(ids[k]);
    if (el) el.style.display = 'none';
  }
  let ui = document.getElementById('startUI');
  if (ui) ui.style.display = 'none';
  if (world && world.stop) world.stop();
  keyboard = new Keyboard();
  if (canvas)
    canvas
      .getContext('2d')
      .clearRect(0, 0, canvas.width, canvas.height);
  init();
  checkOrientation();
  focusCanvas();
  for (let s in sounds) {
    sounds[s].pause();
    sounds[s].currentTime = 0;
  }
  audioGame.play().catch(() => {});
}
window.resetGame = resetGame;
window.showStart = showStart;
window.startGame = startGame;
window.toggleFullscreen = toggleFullscreen;
window.press = press;
window.release = release;

/**
 * Displays the game over screen and plays the lose sound.
 * @returns {void}
 */
function showGameOver() {
  stopAllSoundsExcept('over');
  audioGameOver.currentTime = 0;
  audioGameOver.play().catch(() => {});
  document.getElementById('gameOverOverlay').style.display = 'block';
}

/**
 * Displays the win screen and plays the victory sound.
 * @returns {void}
 */
function showYouWon() {
  // [MYA NEW]
  audioGame.pause();
  audioGame.currentTime = 0;
  audioWin.currentTime = 0;
  audioWin.play().catch(() => {});
  document.getElementById('youWonOverlay').style.display = 'block';
}

window.showGameOver = showGameOver; // [MYA NEW]
window.showYouWon = showYouWon; // [MYA NEW]

// [MYA FIX] Inline-HTML braucht globale Referenzen
window.handleKeyDown = handleKeyDown;
window.handleKeyUp = handleKeyUp;

// [MYA FIX] Inline-HTML braucht globale Referenzen
window.checkOrientation = checkOrientation;
window.applyAutoLayoutFullscreen = applyAutoLayoutFullscreen;
