import createSquare from '~/components/Square';
import {
  selectedSquare,
  setSelectedSquare,
  pieces,
  setPieces,
  highlights,
  setHighlights
} from '~/state/gameState';
import { Assets, Sprite } from 'pixi.js';
import { highlightValidMovesForPiece } from '~/pixi/highlight';

const TILE_SIZE = 80;
const loadedTextures = {};

// Utility: Checks if the given square is selected
function isSquareSelected(rowIndex, columnIndex) {
  const currentSelection = selectedSquare();
  return currentSelection &&
    currentSelection.row === rowIndex &&
    currentSelection.col === columnIndex;
}

// Utility: Gets highlight metadata for a square
function getHighlightData(rowIndex, columnIndex) {
  return highlights().find(highlight =>
    highlight.row === rowIndex && highlight.col === columnIndex
  );
}

// Handles square click logic: move, select, or deselect
async function handleSquareClick(rowIndex, columnIndex, pixiApplication) {
  const clickedPiece = pieces().find(
    piece => piece.row === rowIndex && piece.col === columnIndex
  );

  const isTargetSquareHighlighted = highlights().some(
    highlight => highlight.row === rowIndex && highlight.col === columnIndex
  );

  if (isTargetSquareHighlighted && selectedSquare()) {
    const updatedPieces = pieces()
      .filter(
        piece => !(piece.row === rowIndex && piece.col === columnIndex) // remove captured
      )
      .map(piece => {
        if (
          piece.row === selectedSquare().row &&
          piece.col === selectedSquare().col
        ) {
          return { ...piece, row: rowIndex, col: columnIndex }; // move selected
        }
        return piece;
      });

    setPieces(updatedPieces);
    setSelectedSquare(null);
    setHighlights([]);
  } else if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
    setSelectedSquare({ row: rowIndex, col: columnIndex });

    const newHighlights = [];
    highlightValidMovesForPiece(
      clickedPiece,
      (highlightRow, highlightCol, color) => {
        newHighlights.push({
          row: highlightRow,
          col: highlightCol,
          color
        });
      },
      pieces()
    );

    setHighlights(newHighlights);
  } else {
    setSelectedSquare(null);
    setHighlights([]);
  }

  await drawBoard(pixiApplication);
}

// Renders board squares and piece sprites to the PixiJS stage
export async function drawBoard(pixiApplication) {
  pixiApplication.stage.removeChildren();
  pixiApplication.stage.sortableChildren = true;

  // Draw each square
  for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
      const isDarkSquare = (rowIndex + columnIndex) % 2 === 1;
      const backgroundColor = isDarkSquare ? 0x005500 : 0x55FF55;

      const selected = isSquareSelected(rowIndex, columnIndex);
      const highlightData = getHighlightData(rowIndex, columnIndex);
      const isHighlighted = !!highlightData;
      const highlightBorderColor = highlightData?.color ?? 0xffff00;

      const squareGraphic = createSquare({
        x: columnIndex * TILE_SIZE,
        y: rowIndex * TILE_SIZE,
        size: TILE_SIZE,
        color: backgroundColor,
        highlighted: selected || isHighlighted,
        highlightColor: highlightBorderColor,
        onClick: () => handleSquareClick(rowIndex, columnIndex, pixiApplication)
      });

      pixiApplication.stage.addChild(squareGraphic);
    }
  }

  // Draw each piece
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

    pieceSprite.x = piece.col * TILE_SIZE;
    pieceSprite.y = piece.row * TILE_SIZE;
    pieceSprite.zIndex = 2;

    pixiApplication.stage.addChild(pieceSprite);
  }
}
