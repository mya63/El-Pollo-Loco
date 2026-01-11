/**
 * UI helpers (info overlay + legal modal) for the game.
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
function renderInfoList() {
  let box = document.getElementById('infoList');
  if (!box) return;

  let html = '';
  for (let key in UI.controls) {
    html += `
      <p>
        <span class="kbd">${key}</span>
        <span class="info-sep">–</span>
        <span class="info-label">${UI.controls[key]}</span>
      </p>`;
  }
  box.innerHTML = html;
}

/**
 * Displays the info overlay.
 * @returns {void}
 */
function showInfo() {
  renderInfoList();

  let card = document.getElementById('infoCard');
  let startUI = document.getElementById('startUI');

  if (startUI && startUI.style.display !== 'none') {
    startUI.style.display = 'none';
  }

  if (!card) return;
  card.style.display = 'flex';
  card.setAttribute('aria-hidden', 'false');
  UI.open = true;
}
window.showInfo = showInfo;

/**
 * Hides the info overlay and restores the start UI if needed.
 * @returns {void}
 */
function hideInfo() {
  let card = document.getElementById('infoCard');
  let startUI = document.getElementById('startUI');
  let overlay = document.getElementById('startOverlay');

  if (card) {
    card.style.display = 'none';
    card.setAttribute('aria-hidden', 'true');
  }

  UI.open = false;

  if (overlay && overlay.style.display !== 'none' && startUI) {
    startUI.style.display = 'grid';
  }

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

/**
 * Opens the legal modal and stores the previously focused element.
 * @returns {void}
 */
function openLegalModal() {
  const modal = document.getElementById('legalModal');
  if (!modal) return;

  lastFocusedElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

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

  const shouldFocusCanvas =
    !lastFocusedElement || lastFocusedElement.id === 'canvas';

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
