/**
 * Game audio setup and sound helper functions.
 * @module game-audio
 */

const audioStart = new Audio("audio/start.ogg");
const audioGame = new Audio("audio/game.mp3");
const audioWin = new Audio("audio/win.mp3");
const audioGameOver = new Audio("audio/gameover.mp3");
const throwSound = new Audio("audio/throw.mp3");
const audioSnore = new Audio("audio/snore.mp3");
const audioHit = new Audio("audio/hit.mp3");
const audioHurt = new Audio("audio/hurt.mp3");
const audioPickup = new Audio("audio/pickup.mp3");
const audioEnemyDead = new Audio("audio/enemy-dead.mp3");
const audioBreak = new Audio("audio/break.mp3");

audioSnore.loop = true;
audioStart.loop = true;
audioGame.loop = true;

const sounds = {
  start: audioStart,
  game: audioGame,
  win: audioWin,
  over: audioGameOver,
  throw: throwSound,
  snore: audioSnore,
  enemyDead: audioEnemyDead,
  break: audioBreak,
  hit: audioHit,
  hurt: audioHurt,
  pickup: audioPickup,
};

/**
 * Plays a sound safely (restarts sound).
 * @param {string} key - Sound key from sounds object.
 * @param {number} [maxMs=0] - Optional max play time in ms.
 * @returns {void}
 */
function playSound(key, maxMs = 0) {
  if (!sounds[key] || sounds[key].muted) return;
  if (sounds[key].paused === false && key === "hurt") return;
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
  playSound("throw");
}

/**
 * Plays the snore sound once safely.
 * @returns {void}
 */
function playSnoreSound() {
  if (!sounds.snore || sounds.snore.muted) return;
  if (!sounds.snore.paused) return;
  sounds.snore.currentTime = 0;
  sounds.snore.play().catch(() => {});
}

/**
 * Stops the snore sound.
 * @returns {void}
 */
function stopSnoreSound() {
  if (!sounds.snore) return;
  sounds.snore.pause();
  sounds.snore.currentTime = 0;
}

/**
 * Sets default volume for all sounds.
 * @returns {void}
 */
function setDefaultVolumes() {
  for (let k in sounds) sounds[k].volume = 0.2;
  audioSnore.volume = 0.15; // [MYA NEW]
}
setDefaultVolumes();

/**
 * Updates the mute button to reflect current sound state.
 * @returns {void}
 */
function updateMuteButton() {
  let btn = document.getElementById("muteBtn");
  if (btn) btn.innerText = sounds.start.muted ? "🔇" : "🔊";
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
  const muted = localStorage.getItem("soundMuted") === "true";
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
  localStorage.setItem("soundMuted", next);
  updateMuteButton();
  const btn = document.getElementById("muteBtn");
  if (btn && document.activeElement === btn) btn.blur();
  if (window.focusCanvas) window.focusCanvas();
}

/**
 * Stops all sounds except a given key.
 * @param {string} key - Sound key to keep playing.
 * @returns {void}
 */
function stopAllSoundsExcept(key) {
  for (let k in sounds) {
    if (k === key) continue;
    sounds[k].pause();
    sounds[k].currentTime = 0;
  }
}

window.audioStart = audioStart;
window.audioGame = audioGame;
window.audioWin = audioWin;
window.audioGameOver = audioGameOver;
window.sounds = sounds;
window.playSound = playSound;
window.playThrowSound = playThrowSound;
window.playSnoreSound = playSnoreSound;
window.stopSnoreSound = stopSnoreSound;
window.updateMuteButton = updateMuteButton;
window.setAllSoundsMuted = setAllSoundsMuted;
window.loadSoundState = loadSoundState;
window.toggleMute = toggleMute;
window.stopAllSoundsExcept = stopAllSoundsExcept;
