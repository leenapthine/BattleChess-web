import {
  pieces,
  setPieces,
  highlights,
  setHighlights,
  selectedSquare,
  setSelectedSquare,
} from '~/state/gameState';
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';

/**
 * Handles all click interactions for the GhoulKing piece, including its raise ability.
 * - Clicking the GhoulKing twice shows adjacent tiles to raise a NecroPawn.
 * - Clicking an eligible highlighted tile will raise the pawn and consume the ability.
 *
 * @param {number} row - The row of the clicked square.
 * @param {number} col - The column of the clicked square.
 * @param {PIXI.Application} pixiApp - The PixiJS application instance.
 * @returns {Promise<boolean>} True if the click was handled by GhoulKing logic.
 */
export async function handleGhoulKingClick(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedCoord = selectedSquare();
  const selectedPiece = selectedCoord ? getPieceAt(selectedCoord, currentPieces) : null;
  const isRaiseTile = highlights().some(h => h.row === row && h.col === col && h.color === 0x00ffff);

  // === Step 3: Raise NecroPawn on a valid adjacent tile
  if (
    selectedPiece?.type === 'GhoulKing' &&
    selectedPiece.raisesLeft > 0 &&
    isRaiseTile &&
    Math.abs(row - selectedPiece.row) <= 1 &&
    Math.abs(col - selectedPiece.col) <= 1 &&
    !getPieceAt({ row, col }, currentPieces)
  ) {
    const newNecroPawn = {
      id: crypto.randomUUID(),
      type: 'NecroPawn',
      color: selectedPiece.color,
      row,
      col,
      stunned: false,
      isStone: false,
    };

    const updatedGhoulKing = { ...selectedPiece, raisesLeft: 0 };
    const remainingPieces = currentPieces.filter(p => p.id !== selectedPiece.id);

    setPieces([...remainingPieces, updatedGhoulKing, newNecroPawn]);
    setHighlights([]);
    setSelectedSquare(null);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  // === Step 2: Second click on GhoulKing to activate raise mode
  if (
    selectedPiece?.type === 'GhoulKing' &&
    selectedPiece.row === row &&
    selectedPiece.col === col &&
    selectedPiece.raisesLeft > 0
  ) {
    const validRaiseTargets = [];

    for (let offsetY = -1; offsetY <= 1; offsetY++) {
      for (let offsetX = -1; offsetX <= 1; offsetX++) {
        const targetRow = selectedPiece.row + offsetY;
        const targetCol = selectedPiece.col + offsetX;

        const isWithinBounds = targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8;
        const isNotSelf = !(targetRow === selectedPiece.row && targetCol === selectedPiece.col);
        const isUnoccupied = isWithinBounds && !getPieceAt({ row: targetRow, col: targetCol }, currentPieces);

        if (isNotSelf && isUnoccupied) {
          validRaiseTargets.push({ row: targetRow, col: targetCol, color: 0x00ffff });
        }
      }
    }

    setHighlights(validRaiseTargets);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  // Not handled by GhoulKing logic
  return false;
}
