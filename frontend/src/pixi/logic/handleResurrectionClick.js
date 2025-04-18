import {
  pieces,
  setPieces,
  setResurrectionTargets,
  setPendingResurrectionColor,
  pendingResurrectionColor,
  resurrectionTargets
} from '~/state/gameState';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';
import { highlightRaiseDeadTiles } from '~/pixi/pieces/necro/Necromancer';


/**
 * Handles resurrection of a pawn at the clicked location.
 * 
 * @param {number} rowIndex - Row of the clicked square.
 * @param {number} columnIndex - Column of the clicked square.
 * @param {import('pixi.js').Application} pixiApp - PixiJS application instance.
 * @returns {boolean} - Returns true if a resurrection was performed.
 */
export async function handleResurrectionClick(rowIndex, columnIndex, pixiApp) {
  const isResTarget = resurrectionTargets().some(
    pos => pos.row === rowIndex && pos.col === columnIndex
  );

  if (isResTarget && pendingResurrectionColor()) {
    const resurrectedPawn = {
      id: Date.now(),
      type: 'Pawn',
      color: pendingResurrectionColor(),
      row: rowIndex,
      col: columnIndex
    };

    setPieces([...pieces(), resurrectedPawn]);
    setResurrectionTargets([]);
    setPendingResurrectionColor(null);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  return false;
}

/**
 * Triggers the resurrection ability for a Necromancer after a successful capture.
 *
 * If the moving piece is a Necromancer and the captured piece belongs to the opponent,
 * this function highlights all adjacent empty tiles around the destination square
 * where a resurrection (Pawn placement) could occur.
 *
 * @param {Object} movingPiece - The piece that initiated the move (potentially a Necromancer).
 * @param {Object|null} capturedPiece - The piece that was captured, if any.
 * @param {{ row: number, col: number }} destination - The square the piece moved to.
 * @param {Array} updatedPieces - The updated list of pieces after the move.
 */
export function triggerResurrectionPrompt(movingPiece, capturedPiece, destination, updatedPieces) {
  if (
    movingPiece?.type === 'Necromancer' &&
    capturedPiece &&
    capturedPiece.color !== movingPiece.color
  ) {
    highlightRaiseDeadTiles(destination, updatedPieces, movingPiece.color);
  }
}
