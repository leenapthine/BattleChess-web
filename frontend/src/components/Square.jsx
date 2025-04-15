import { Graphics } from 'pixi.js';

export default function createSquare({
  x, y, size,
  color,
  highlighted = false,
  highlightColor = 0xffff00,
  onClick = null
}) {
  const square = new Graphics();

  // Base square fill
  square.rect(0, 0, size, size).fill({ color });

  // Inner highlight stroke (fully inside the square)
  if (highlighted) {
    const inset = 4; // pixels inset from each edge
    square
      .rect(inset, inset, size - 2 * inset, size - 2 * inset)
      .stroke({ color: highlightColor, width: 6 });
  }

  square.x = x;
  square.y = y;
  square.eventMode = 'static';

  if (typeof onClick === 'function') {
    square.addEventListener('pointertap', () => {
      onClick({ x, y });
    });
  }

  return square;
}
