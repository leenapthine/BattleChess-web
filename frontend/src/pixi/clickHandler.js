import {
  selectedSquare,
  setSelectedSquare,
  pieces,
  highlights,
  setHighlights,
} from '~/state/gameState';

import { highlightValidMovesForPiece } from '~/pixi/highlight';
import { isSquareSelected } from '~/pixi/utils';
import { handleResurrectionClick } from '~/pixi/logic/handleResurrectionClick';
import { handleSacrificeClick } from '~/pixi/logic/handleSacrificeClick';
import { handlePieceMove } from '~/pixi/logic/handlePieceMove';
import { clearBoardState } from '~/pixi/logic/clearBoardState';
import { drawBoard } from '~/pixi/drawBoard';

/**
 * Main click handler for the game board.
 *
 * Responds to clicks by determining whether the action should:
 * - Trigger a NecroPawn sacrifice
 * - Move a piece to a valid square
 * - Select a new piece
 * - Complete a resurrection
 * - Or simply clear the current selection
 *
 * @param {number} rowIndex - The row of the clicked square.
 * @param {number} columnIndex - The column of the clicked square.
 * @param {Application} pixiApplication - PixiJS application instance managing the canvas.
 */
export async function handleSquareClick(rowIndex, columnIndex, pixiApplication) {
  const currentPieces = pieces(); // freeze signal to avoid stale reads mid-handler
  const clickedPiece = currentPieces.find(
    piece => piece.row === rowIndex && piece.col === columnIndex
  );

  const squareIsHighlighted = highlights().some(highlight =>
    highlight.row === rowIndex &&
    highlight.col === columnIndex &&
    !(selectedSquare()?.row === rowIndex && selectedSquare()?.col === columnIndex)
  );

  // 1. Check for NecroPawn sacrifice
  if (await handleSacrificeClick(rowIndex, columnIndex, pixiApplication, currentPieces)) return;

  // 2. Attempt to move selected piece to a valid destination
  if (squareIsHighlighted && selectedSquare()) {
    const moveTarget = { row: rowIndex, col: columnIndex };
    const moved = await handlePieceMove(moveTarget, pixiApplication);
    if (moved) return;
  }

  // 3. Select a new piece
  if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
    await clearBoardState(pixiApplication);
    setSelectedSquare({ row: rowIndex, col: columnIndex });

    const moveHighlights = [];
    highlightValidMovesForPiece(
      clickedPiece,
      (row, col, color) => moveHighlights.push({ row, col, color }),
      currentPieces
    );

    setHighlights(moveHighlights);
    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // 4. Handle resurrection placement
  if (await handleResurrectionClick(rowIndex, columnIndex, pixiApplication)) return;

  // 5. Clicked empty square or re-clicked selected square — clear everything
  await clearBoardState(pixiApplication);
  await drawBoard(pixiApplication, handleSquareClick);
}
