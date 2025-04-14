import { Graphics } from 'pixi.js';

export default function createSquare({ x, y, size, color, highlighted = false, highlightColor = 0xffff00, onClick = null }) {
  const square = new Graphics()
    .rect(0, 0, size, size)
    .fill({ color });

  if (highlighted) {
    square.setStrokeStyle({ width: 4, color: highlightColor });
    square.rect(0, 0, size, size);
    square.stroke();
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
