import { Graphics } from 'pixi.js';

/**
 * Creates a square graphic for the board with optional highlight and click handler.
 *
 * @param {Object} params - Configuration for the square.
 * @param {number} params.x - The x-coordinate on the Pixi stage.
 * @param {number} params.y - The y-coordinate on the Pixi stage.
 * @param {number} params.size - The width/height of the square in pixels.
 * @param {number} params.color - The fill color of the square.
 * @param {boolean} [params.highlighted=false] - Whether the square is highlighted.
 * @param {number} [params.highlightColor=0xffff00] - Highlight border color.
 * @param {Function|null} [params.onClick=null] - Optional click handler callback.
 *
 * @returns {Graphics} A configured PixiJS Graphics object.
 */
export default function createSquare({
  x,
  y,
  size,
  color,
  highlighted = false,
  highlightColor = 0xffff00,
  onClick = null
}) {
  const squareGraphic = new Graphics();

  // Draw the base square
  squareGraphic.rect(0, 0, size, size).fill({ color });

  // Draw inner highlight border (entirely inside the square edges)
  if (highlighted) {
    const inset = 4;
    squareGraphic
      .rect(inset, inset, size - 2 * inset, size - 2 * inset)
      .stroke({ color: highlightColor, width: 6 });
  }

  squareGraphic.x = x;
  squareGraphic.y = y;
  squareGraphic.eventMode = 'static';

  // Attach click event if provided
  if (typeof onClick === 'function') {
    squareGraphic.addEventListener('pointertap', () => {
      onClick({ x, y });
    });
  }

  return squareGraphic;
}
