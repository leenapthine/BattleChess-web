import { Graphics } from 'pixi.js';

export default function createSquare({ x, y, size, color, highlighted = false, highlightColor = 0xffff00 }) {
  const square = new Graphics()
    .rect(0, 0, size, size)
    .fill({ color });

  if (highlighted) {
    square.setStrokeStyle({ width: 4, color: highlightColor });
    square.rect(0, 0, size, size);
  }

  square.x = x;
  square.y = y;

  return square;
}
