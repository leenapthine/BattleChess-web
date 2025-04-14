import createSquare from '~/components/Square';
import { selectedSquare, setSelectedSquare } from '~/state/gameState';

const TILE_SIZE = 80;

export function drawBoard(app) {
  app.stage.removeChildren();
  app.stage.sortableChildren = true;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {            
      let isDark = (row + col) % 2 === 1;
      const fillColor = isDark ? 0x7f7f7f : 0xffffff;

      const isSelected =
        selectedSquare() &&
        selectedSquare().row === row &&
        selectedSquare().col === col;

      const square = createSquare({
        x: col * TILE_SIZE,
        y: row * TILE_SIZE,
        size: TILE_SIZE,
        color: fillColor,
        highlighted: isSelected,
        highlightColor: 0xffff00,
        onClick: () => {
          console.log('Selected:', row, col);
          setSelectedSquare({ row, col });
          drawBoard(app);
        }
      });

      // Bump selected (highlighted) square to the top
      square.zIndex = isSelected ? 1 : 0;
        
      app.stage.addChild(square);
    }
  }
}