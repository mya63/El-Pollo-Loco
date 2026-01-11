/**
 * Represents the keyboard input state.
 * Each property reflects whether a key is currently pressed.
 */
class Keyboard {
  /** @type {boolean} Left arrow key */
  LEFT = false;

  /** @type {boolean} Right arrow key */
  RIGHT = false;

  /** @type {boolean} Up arrow key */
  UP = false;

  /** @type {boolean} Down arrow key */
  DOWN = false;

  /** @type {boolean} Space key (jump) */
  SPACE = false;

  /** @type {boolean} D key (throw bottle) */
  D = false;

  /** @type {boolean} True if one throw is requested */
  D_ONCE = false;

  /** @type {boolean} Prevents repeated throws while holding the key */
  D_LOCK = false;
}
