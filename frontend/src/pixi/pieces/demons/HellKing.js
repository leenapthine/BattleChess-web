// Description: Logic module for the HellKing, a level 2 King from the Demon guild.
//
// Main Functions:
// - highlightMoves(hellKing, addHighlight, allPieces):
//     Highlights all valid 1-tile movement options in any direction (standard King movement).
// - handleHellKingCapture(row, col, pixiApp, isTurn):
//     Handles capture logic where the HellKing "converts" an enemy piece into a friendly unit
//     instead of moving into its square.
//
// Special Features:
// - The HellKing moves and captures like a standard King — one square in any direction.
// - When capturing, the HellKing does **not** move.
// - Instead, the target enemy unit is turned into a friendly unit (color is flipped).
// - The converted piece stays in its current position, now controlled by the HellKing's side.
// - Cannot convert stone units or friendly units.
// - Level 2 King from the Demon guild.

import { highlightMoves as highlightStandardKingMoves } from '~/pixi/pieces/basic/King';
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import {
  pieces,
  selectedSquare,
  setSelectedSquare,
  setPieces,
  setHighlights,
  switchTurn,
} from '~/state/gameState';

/**
 * Highlights all valid moves for the HellKing piece.
 * Inherits standard King behavior with diagonal movement.
 *
 * @param {Object} hellKing - The HellKing piece being selected.
 * @param {Function} addHighlight - Callback used to push highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(hellKing, addHighlight, allPieces) {
  highlightStandardKingMoves(hellKing, addHighlight, allPieces);
}

/**
 * Handles the logic when the HellKing attempts to capture an opponent piece.
 * The HellKing captures an enemy piece anf takes control of it.
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export function handleHellKingCapture(row, col, pixiApp, isTurn) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const hellKingPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const targetPiece = getPieceAt({ row, col }, currentPieces);

  // Ensure the selected piece is a HellKing and it's not clicking on itself
  if (!hellKingPiece || hellKingPiece.type !== 'HellKing' || targetPiece === hellKingPiece) return false;

  // Check if the target piece is an enemy piece
  if (targetPiece && targetPiece.color !== hellKingPiece.color && targetPiece.isStone !== true && isTurn) {
    let updatedPieces = currentPieces.filter(p => p.id !== targetPiece.id);

    // Now, the HellKing transforms into the captured piece (keeping the color of HellKing)
    const transformedPiece = { ...targetPiece };
    transformedPiece.color = hellKingPiece.color;

    // Replace the HellKing with the transformed piece on the board
    transformedPiece.row = row;
    transformedPiece.col = col;

    // Remove the HellKing from the board and add the transformed piece
    updatedPieces.push(transformedPiece);

    setPieces(updatedPieces);
    setSelectedSquare(null);
    setHighlights([]);
    switchTurn();

    drawBoard(pixiApp, handleSquareClick);
    return true;
    }
  return false;
}
