import createSquare from '~/components/Square';
import { selectedSquare, setSelectedSquare, pieces } from '~/state/gameState';
import { Assets, Sprite } from 'pixi.js';

const TILE_SIZE = 80;
const loadedSprites = {};

export async function drawBoard(app) {
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

  // Draw Pieces
  for (const piece of pieces()) {
    const textureId = `/sprites/${piece.color}${piece.type}.png`;

    if (!loadedSprites[textureId]) {
      const texture = await Assets.load(textureId);
      texture.source.scaleMode = 'nearest';
      texture.source.style.update();
      loadedSprites[textureId] = texture;
    }

    const sprite = new Sprite(loadedSprites[textureId]);    
    const scale = TILE_SIZE / sprite.texture.width;
    sprite.scale.set(scale);

    sprite.x = piece.col * TILE_SIZE;
    sprite.y = piece.row * TILE_SIZE;
    sprite.zIndex = 2;
    app.stage.addChild(sprite);
  }
}