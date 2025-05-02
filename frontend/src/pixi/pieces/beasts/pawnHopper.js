// Description: Logic module for the PawnHopper, a level 2 pawn from the BeastMaster Guild.
//
// Main Functions:
// - highlightMoves(pawnHopper, addHighlight, allPieces):
//     Highlights all valid movement and capture tiles for the PawnHopper, including two-step hop captures.
// - applyHopperCapture(from, destination, allPieces, color):
//     If a PawnHopper performs a 2-tile forward move, captures the enemy piece it hops over.
// - handlePawnHopperPostMove(from, destination, movedPieces, movingPiece, color):
//     Post-move logic handler that delegates to applyHopperCapture if needed.
//
// Special Features or Notes:
// - The PawnHopper can move forward 1 or 2 tiles regardless of move history.
// - Captures diagonally like a standard pawn.
// - Can also capture by hopping forward 2 tiles over an enemy unit (only if square behind is empty).

import { highlightMoves as highlightStandardPawnMoves } from '~/pixi/pieces/basic/Pawn';
import { getPieceAt } from '~/pixi/utils';
import { currentTurn } from '~/state/gameState';

/**
 * Highlights all valid moves for a PawnHopper piece.
 * Extends normal pawn behavior with a forward hop capture mechanic.
 *
 * @param {Object} pawnHopper - The PawnHopper piece being selected.
 * @param {Function} addHighlight - Callback used to push highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(pawnHopper, addHighlight, allPieces) {
  const direction = pawnHopper.color === 'White' ? 1 : -1;
  const oneStepRow = pawnHopper.row + direction;
  const twoStepRow = pawnHopper.row + 2 * direction;
  const column = pawnHopper.col;

  // Inherit single-step and diagonal capture logic from standard Pawn
  highlightStandardPawnMoves(pawnHopper, addHighlight, allPieces);

  // Get current turn directly from the signal
  const isOpponentTurn = pawnHopper.color !== currentTurn();

  // Add highlight for 2-step forward movement (hop capture)
  const squareAhead = getPieceAt({ row: oneStepRow, col: column }, allPieces);
  const squareTwoAhead = getPieceAt({ row: twoStepRow, col: column }, allPieces);

  if (!squareTwoAhead) {
    const isHopCapture = squareAhead && squareAhead.color !== pawnHopper.color;
    const highlightColor = isOpponentTurn 
    ? (isHopCapture ? 0xe5e4e2 : 0xd3d3d3) // Grey if opponent's turn, otherwise yellow
    : (isHopCapture ? 0xff0000 : 0xffff00);
    addHighlight(twoStepRow, column, highlightColor);
  }
}

/**
 * If a PawnHopper hops 2 tiles forward and there's an enemy between, remove it.
 *
 * @param {{ row: number, col: number }} from - Origin square of the piece.
 * @param {{ row: number, col: number }} destination - Target square after movement.
 * @param {Array} allPieces - Current board pieces after movement.
 * @param {string} color - Color of the moving PawnHopper ('White' or 'Black').
 * @returns {{ updatedPieces: Array, captured: Object|null }} - New board and optional captured piece.
 */
export function applyHopperCapture(from, destination, allPieces, color) {
  const direction = color === 'White' ? 1 : -1;
  const isTwoStepForward = Math.abs(destination.row - from.row) === 2;
  const sameColumn = destination.col === from.col;

  if (isTwoStepForward && sameColumn) {
    const hoppedRow = from.row + direction;
    const hoppedEnemy = getPieceAt({ row: hoppedRow, col: from.col }, allPieces);

    if (hoppedEnemy && hoppedEnemy.color !== color) {
      const filteredBoard = allPieces.filter(
        piece => !(piece.row === hoppedRow && piece.col === from.col)
      );
      return {
        updatedPieces: filteredBoard,
        captured: hoppedEnemy,
      };
    }
  }

  return {
    updatedPieces: allPieces,
    captured: null,
  };
}

/**
 * Handles post-move PawnHopper effects (hop-capture).
 *
 * @param {{ row: number, col: number }} from - Square the piece moved from.
 * @param {{ row: number, col: number }} destination - Square the piece moved to.
 * @param {Array} movedPieces - Current piece list after basic movement.
 * @param {Object} movingPiece - The PawnHopper piece that just moved.
 * @param {string} color - Color of the PawnHopper.
 * @returns {{ updatedPieces: Array, captured: Object|null }} Resulting state and capture (if any).
 */
export function handlePawnHopperPostMove(from, destination, movedPieces, movingPiece, color) {
  if (movingPiece.type !== 'PawnHopper') {
    return {
      updatedPieces: movedPieces,
      captured: null,
    };
  }

  const direction = color === 'White' ? 1 : -1;
  const isTwoStepForward = Math.abs(destination.row - from.row) === 2;
  const sameColumn = destination.col === from.col;

  if (isTwoStepForward && sameColumn) {
    const hoppedRow = from.row + direction;
    const hoppedPiece = getPieceAt({ row: hoppedRow, col: from.col }, movedPieces);

    if (hoppedPiece && hoppedPiece.color !== color) {
      return applyHopperCapture(from, destination, movedPieces, color);
    }
  }

  return {
    updatedPieces: movedPieces,
    captured: null,
  };
}
