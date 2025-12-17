/**
 * Represents a game level.
 * Holds all level-related objects and boundaries.
 */
class Level {
  /** @type {Array} List of enemies in the level */
  enemies;

  /** @type {Array} List of clouds in the level */
  clouds;

  /** @type {Array} Background objects of the level */
  backgroundObjects;

  /** @type {Array} Collectable bottles in the level */
  bottles;

  /** @type {number} X-position where the level ends */
  level_end_x = 2200;

  /**
   * Creates a new level instance.
   * @param {Array} enemies - All enemy objects.
   * @param {Array} clouds - All cloud objects.
   * @param {Array} backgroundObjects - Background elements.
   * @param {Array} bottles - Collectable bottle objects.
   */
  constructor(enemies, clouds, backgroundObjects, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles || [];
  }
}
