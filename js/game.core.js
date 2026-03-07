/**
 * Core game bootstrap and global UI handlers.
 * Split file to keep under 400 lines.
 * @module game-core
 */

let canvas;
let world;
let keyboard = new Keyboard();
let isGameRunning = false;

/**
 * User interface state and control descriptions.
 * @type {{open: boolean, controls: Record<string, string>}}
 */
const UI = {
  open: false,
  controls: {
    "←": "Move",
    "→": "Move",
    SPACE: "Jump",
    D: "Throw bottle",
  },
};

let lastFocusedElement = null;

/**
 * Applies a CSS-based "fullscreen" layout on small/touch devices.
 * Uses media queries instead of the Fullscreen API.
 * @returns {void}
 */
function applyAutoLayoutFullscreen() {
  const small = window.matchMedia("(max-width: 1024px)").matches;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const lowH = window.matchMedia("(max-height: 700px)").matches;
  const on = (small && touch) || lowH;
  document.body.classList.toggle("play-mode", on);
}

/**
 * Shows or hides the HUD based on game state.
 * @param {boolean} show - True to show HUD.
 * @returns {void}
 */
function setHudVisible(show) {
  let hud = document.getElementById("hud");
  if (!hud) return;
  hud.style.display = show ? "flex" : "none";
}

/**
 * Displays the start screen and prepares the game.
 * @returns {void}
 */
function showStart() {
  canvas = document.getElementById("canvas");
  if (canvas) canvas.style.visibility = "hidden";
  document.getElementById("startOverlay").style.display = "block";
  document.getElementById("startUI").style.display = "grid";
  setHudVisible(false);
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
  if (!canvas) canvas = document.getElementById("canvas");
  if (!canvas) return;
  if (!canvas.hasAttribute("tabindex")) canvas.setAttribute("tabindex", "0");
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
  isGameRunning = true;
  setHudVisible(true);
  applyAutoLayoutFullscreen();
  document.getElementById("startOverlay").style.display = "none";
  document.getElementById("startUI").style.display = "none";
  if (canvas) canvas.style.visibility = "visible";
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
  let btn = document.getElementById("fsBtn");
  if (btn) btn.innerText = document.fullscreenElement ? "✖" : "⛶";
  focusCanvas();
};

/**
 * Toggles the game's fullscreen mode.
 * @returns {void}
 */
function toggleFullscreen() {
  let el = document.getElementById("stage");
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
 * @returns {void}
 */
function checkOrientation() {
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  const overlay = document.getElementById("rotateOverlay");
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!overlay) return;
  overlay.style.display = portrait && isMobile ? "flex" : "none";
}

/**
 * Runs orientation check on device orientation change.
 * @returns {void}
 */
window.onorientationchange = function () {
  checkOrientation();
};

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

/**
 * Activates a key from on-screen controls.
 * @param {string} key - Key name.
 * @param {HTMLElement} [el] - Control element.
 * @returns {boolean} Always returns false.
 */
function press(key, el) {
  if (el) el.setAttribute("data-active", "1");
  if (key === "D") triggerThrowOnce();
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
  if (el) el.removeAttribute("data-active");
  if (key === "D") releaseThrowLock();
  else setKey(key, false);
  return false;
}

/**
 * Handles keyup events and updates the keyboard state.
 * @param {KeyboardEvent} e - Keyboard event.
 * @returns {void}
 */
function handleKeyUp(e) {
  if (e.code === "ArrowRight") keyboard.RIGHT = false;
  if (e.code === "ArrowLeft") keyboard.LEFT = false;
  if (e.code === "ArrowUp") keyboard.UP = false;
  if (e.code === "ArrowDown") keyboard.DOWN = false;
  if (e.code === "Space") keyboard.SPACE = false;

  if (e.code === "KeyD") {
    releaseThrowLock();
    if (world) world.throwLock = false;
  }
}

/**
 * Triggers a single throw action per key press.
 * @returns {void}
 */
function triggerThrowOnce() {
  if (keyboard.D_LOCK) return;
  keyboard.D_ONCE = true;
  keyboard.D_LOCK = true;
}

/**
 * Releases the throw lock after key release.
 * @returns {void}
 */
function releaseThrowLock() {
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
  if (e.key === "Escape" && typeof closeLegalModal === "function")
    closeLegalModal();
  if (e.code === "ArrowRight") keyboard.RIGHT = true;
  if (e.code === "ArrowLeft") keyboard.LEFT = true;
  if (e.code === "ArrowUp") keyboard.UP = true;
  if (e.code === "ArrowDown") keyboard.DOWN = true;
  if (e.code === "Space") keyboard.SPACE = true;

  if (e.code === "KeyD") {
    keyboard.D = true;
    triggerThrowOnce();
  }
}

/**
 * Resets the game world and restarts the level.
 * @returns {void}
 */
function resetGame() {
  if (!isGameRunning) return;

  isGameRunning = false;
  document.body.classList.remove("play-mode");

  const ids = { a: "gameOverOverlay", b: "youWonOverlay", c: "startOverlay" };
  for (let k in ids) {
    let el = document.getElementById(ids[k]);
    if (el) el.style.display = "none";
  }

  let ui = document.getElementById("startUI");
  if (ui) ui.style.display = "none";

  if (world && world.stop) world.stop();
  keyboard = new Keyboard();

  if (canvas)
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

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
window.blurToCanvas = blurToCanvas;
window.focusCanvas = focusCanvas;

/**
 * Displays the game over screen and plays the lose sound.
 * @returns {void}
 */
function showGameOver() {
  stopAllSoundsExcept("over");
  audioGameOver.currentTime = 0;
  audioGameOver.play().catch(() => {});
  document.getElementById("gameOverOverlay").style.display = "block";
}

/**
 * Displays the win screen and plays the victory sound.
 * @returns {void}
 */
function showYouWon() {
  audioGame.pause();
  audioGame.currentTime = 0;
  audioWin.currentTime = 0;
  audioWin.play().catch(() => {});
  document.getElementById("youWonOverlay").style.display = "block";
}

window.showGameOver = showGameOver;
window.showYouWon = showYouWon;
window.handleKeyDown = handleKeyDown;
window.handleKeyUp = handleKeyUp;
window.checkOrientation = checkOrientation;
window.applyAutoLayoutFullscreen = applyAutoLayoutFullscreen;
