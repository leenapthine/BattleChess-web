import createSquare from '~/components/Square';
import { pieces, highlights } from '~/state/gameState';
import { Assets, Sprite } from 'pixi.js';
import { isSquareSelected } from '~/pixi/utils';
import { TILE_SIZE } from '~/pixi/constants';
import { resurrectionTargets } from '~/state/gameState';

const loadedTextures = {};

/**
 * Retrieves the highlight metadata for a given board position.
 *
 * @param {number} rowIndex - The row index of the square.
 * @param {number} columnIndex - The column index of the square.
 * @returns {{ row: number, col: number, color: number } | undefined} The highlight metadata, if present.
 */
function getHighlightData(rowIndex, columnIndex) {
  return highlights().find(highlight =>
    highlight.row === rowIndex && highlight.col === columnIndex
  );
}

/**
 * Renders the chessboard grid and pieces to the PixiJS stage.
 *
 * @param {import('pixi.js').Application} pixiApplication - The PixiJS application instance.
 * @param {Function} onSquareClick - Handler function to call when a square is clicked.
 */
export async function drawBoard(pixiApplication, onSquareClick) {
  pixiApplication.stage.removeChildren();
  pixiApplication.stage.sortableChildren = true;

  // Draw board squares
  for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
      const isDarkSquare = (rowIndex + columnIndex) % 2 === 1;
      const squareColor = isDarkSquare ? 0x005500 : 0x55FF55;

      const squareIsSelected = isSquareSelected(rowIndex, columnIndex);
      const highlightData = getHighlightData(rowIndex, columnIndex);
      const squareIsResurrectionTarget = resurrectionTargets().some(
        pos => pos.row === rowIndex && pos.col === columnIndex
      );
      const squareIsHighlighted = squareIsSelected || highlightData || squareIsResurrectionTarget;
      const borderColor = squareIsResurrectionTarget
        ? 0x00CCFF // green for resurrection targets
        : highlightData?.color ?? 0xffff00; // normal highlight or default yellow

      const squareGraphic = createSquare({
        x: columnIndex * TILE_SIZE,
        y: rowIndex * TILE_SIZE,
        size: TILE_SIZE,
        color: squareColor,
        highlighted: squareIsHighlighted,
        highlightColor: borderColor,
        onClick: () => onSquareClick(rowIndex, columnIndex, pixiApplication)
      });

      pixiApplication.stage.addChild(squareGraphic);
    }
  }

  // Draw pieces
  for (const piece of pieces()) {
    const texturePath = `/sprites/${piece.color}${piece.type}.png`;

    if (!loadedTextures[texturePath]) {
      const texture = await Assets.load(texturePath);
      texture.source.scaleMode = 'nearest';
      texture.source.style.update();
      loadedTextures[texturePath] = texture;
    }

    const pieceSprite = new Sprite(loadedTextures[texturePath]);
    const scaleFactor = TILE_SIZE / pieceSprite.texture.width;
    pieceSprite.scale.set(scaleFactor);
    pieceSprite.x = Math.round(piece.col * TILE_SIZE);
    pieceSprite.y = Math.round(piece.row * TILE_SIZE);
    pieceSprite.zIndex = 2;

    pixiApplication.stage.addChild(pieceSprite);
  }
}
