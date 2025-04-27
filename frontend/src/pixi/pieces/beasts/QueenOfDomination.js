// Filename: QueenOfDomination.js
// Description: Logic module for QueenOfDomination, a Level 2 Queen piece from the BeastMaster Guild.
//
// Special Behavior:
// - Moves like a normal Queen (orthogonal and diagonal).
// - Can use a one-time ability per turn to "dominate" an adjacent friendly piece.
// - The dominated piece becomes a Queen temporarily and must immediately move.
// - If the dominated Queen has no valid moves, it instantly reverts to its original form.
//
// Main Functions:
// - highlightMoves(queen, addHighlight, allPieces):
//     Highlights standard Queen movement, plus adjacent friendlies for domination (cyan).
// - applyDominationAbility(queen, targetPiece, allPieces):
//     Stores the original piece inside QueenOfDomination and replaces the target with a Queen sprite.
// - returnOriginalSprite(dominatingQueen, movedPiece, allPieces):
//     After movement, restores the dominated piece to its original type at the new location.

import { getPieceAt } from '~/pixi/utils';
import { highlightMoves as highlightQueenMoves } from '~/pixi/pieces/basic/Queen';
import { setIsInDominationMode } from '~/state/gameState';

/**
 * Highlights valid QueenOfDomination movement.
 * Also highlights adjacent friendly pieces in cyan if domination ability is still available.
 *
 * @param {Object} queen - The QueenOfDomination piece.
 * @param {Function} addHighlight - Callback to register highlights.
 * @param {Array} allPieces - Current list of all active board pieces.
 */
export function highlightMoves(queen, addHighlight, allPieces) {
  highlightQueenMoves(queen, addHighlight, allPieces);

  // Highlight adjacent friendly units if domination ability is unused
  if (!queen.pieceLoaded) {
    const offsets = [-1, 0, 1];
    for (const deltaRow of offsets) {
      for (const deltaCol of offsets) {
        if (deltaRow === 0 && deltaCol === 0) continue;
        const neighborRow = queen.row + deltaRow;
        const neighborCol = queen.col + deltaCol;

        if (neighborRow >= 0 && neighborRow < 8 && neighborCol >= 0 && neighborCol < 8) {
          const neighborPiece = getPieceAt({ row: neighborRow, col: neighborCol }, allPieces);
          if (neighborPiece && neighborPiece.color === queen.color) {
            addHighlight(neighborRow, neighborCol, 0x00ffff); // Cyan highlight for domination candidates
          }
        }
      }
    }
  }
}

/**
 * Applies the domination ability to an adjacent friendly unit.
 * Replaces the target with a Queen sprite and saves the original inside the QueenOfDomination.
 *
 * @param {Object} queen - The QueenOfDomination initiating the domination.
 * @param {Object} targetPiece - The adjacent friendly unit being dominated.
 * @param {Array} allPieces - Current full board state.
 * @returns {Array} Updated list of pieces after domination.
 */
export function applyDominationAbility(queen, targetPiece, allPieces) {
  setIsInDominationMode(true);
  
  if (queen.pieceLoaded) {
    return allPieces; // Ability already used
  }

  const updatedQueen = { ...queen, pieceLoaded: { ...targetPiece } };

  const transformedTarget = {
    ...targetPiece,
    type: 'Queen',
    stunned: false,
    raisesLeft: 0,
    pieceLoaded: null,
  };

  return allPieces.map(piece => {
    if (piece.id === queen.id) return updatedQueen;
    if (piece.id === targetPiece.id) return transformedTarget;
    return piece;
  });
}

/**
 * Reverts a dominated piece back to its original form after the move completes.
 * Restores the original piece at the final destination of the dominated Queen.
 *
 * @param {Object} dominatingQueen - The QueenOfDomination that initiated domination.
 * @param {Object} movedPiece - The moved dominated Queen (now at its final location).
 * @param {Array} allPieces - Current full board state.
 * @returns {Array} Updated list of pieces after reversion.
 */
export function returnOriginalSprite(dominatingQueen, movedPiece, allPieces) {
  setIsInDominationMode(false);

  if (!dominatingQueen.pieceLoaded) {
    return allPieces; // Nothing to revert
  }

  const revivedPiece = {
    ...dominatingQueen.pieceLoaded,
    row: movedPiece.row,
    col: movedPiece.col,
    stunned: false,
    raisesLeft: 0,
    pieceLoaded: null,
  };

  const updatedPieces = allPieces
    .filter(piece => piece.id !== dominatingQueen.pieceLoaded.id) // Remove the temporary Queen
    .map(piece =>
      piece.id === dominatingQueen.id
        ? { ...dominatingQueen, pieceLoaded: null } // Clear the QueenOfDomination tracker
        : piece
    )
    .concat(revivedPiece); // Restore the original piece

  return updatedPieces;
}
