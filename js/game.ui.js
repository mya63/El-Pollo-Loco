/**
 * UI helpers (info overlay + legal modal) for the game.
 * Split file to keep under 400 lines.
 * @module game-ui
 */

/**
 * Simulates a quick tap on a control for touch devices.
 * @param {string} action - Key action name.
 * @returns {void}
 */
function uiTap(action) {
  if (!keyboard) return;
  setKey(action, true);
  setTimeout(() => setKey(action, false), 220);
}
window.uiTap = uiTap;

/**
 * Renders the info list with available controls.
 * @returns {void}
 */
function renderInfoList() { // [MYA CHANGE] Label als eigenes span für sauberes Styling
  let box = document.getElementById('infoList');
  if (!box) return;
  let html = '';
  for (let key in UI.controls) {
    html += `<p><span class="kbd">${key}</span><span class="info-sep">–</span><span class="info-label">${UI.controls[key]}</span></p>`;
  }
  box.innerHTML = html;
}

/**
 * Displays the info overlay.
 * @returns {void}
 */
function showInfo() {
  renderInfoList();
  let c = document.getElementById('infoCard');
  let s = document.getElementById('startUI');
  if (s && s.style.display !== 'none') s.style.display = 'none';
  if (!c) return;
  c.style.display = 'flex';
  c.setAttribute('aria-hidden', 'false');
  UI.open = true;
}
window.showInfo = showInfo;

/**
 * Hides the info overlay and restores start UI if needed.
 * @returns {void}
 */
function hideInfo() {
  let c = document.getElementById('infoCard');
  let s = document.getElementById('startUI');
  let o = document.getElementById('startOverlay');
  if (c) c.style.display = 'none';
  if (c) c.setAttribute('aria-hidden', 'true');
  UI.open = false;
  if (o && o.style.display !== 'none' && s) s.style.display = 'grid';
  focusCanvas();
}
window.hideInfo = hideInfo;

/**
 * Toggles the info overlay visibility.
 * @returns {void}
 */
function toggleInfo() {
  UI.open ? hideInfo() : showInfo();
}
window.toggleInfo = toggleInfo;

function blockContextMenu(e) { // [MYA FIX]
  if (!isGameRunning) return true;
  e.preventDefault();
  return false;
}
window.blockContextMenu = blockContextMenu; // [MYA NEW] für inline HTML


/**
 * Opens the legal modal and stores the previously focused element.
 * @returns {void}
 */
function openLegalModal() {
  const modal = document.getElementById('legalModal');
  if (!modal) return;
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const closeBtn = modal.querySelector('.legal-close');
  if (closeBtn) closeBtn.focus();
}
window.openLegalModal = openLegalModal;

/**
 * Closes the legal modal and restores focus.
 * @returns {void}
 */
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
window.closeLegalModal = closeLegalModal;

/**
 * Plays the bottle throw sound if sounds are not muted.
 * @returns {void}
 */
function playThrowSound() {
  if (sounds.throw.muted) return;
  sounds.throw.currentTime = 0;
  sounds.throw.play().catch(() => {});
}
window.playThrowSound = playThrowSound;

/**
 * Blocks the context menu (long press) on mobile.
 * @param {Event} e - Browser event.
 * @returns {boolean} Always returns false.
 */

