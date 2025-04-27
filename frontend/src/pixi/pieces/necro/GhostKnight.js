// Description: Logic for GhostKnight piece, including movement, highlighting, and auto-stunning adjacent enemy units.
//
// Main Responsibilities:
// - Defines L-shaped movement pattern for the GhostKnight (like a traditional knight).
// - Highlights valid move and capture targets on the board.
// - Applies stun effect to all adjacent enemy units immediately after a move.
//
// Special Traits:
// - Ignores pieces in its path during movement (standard knight behavior).
// - On any valid move (including capture), it stuns all adjacent opponent units.
// - Stunning prevents affected enemies from moving on their next turn.
// - Belongs to the Necromancer faction and is a level-2 unit.
//
// Integration:
// - `highlightMoves`: Used by highlight manager to display valid GhostKnight moves.
// - `applyStunEffect`: Called from `handlePieceMove` after movement is completed.
//
// Dependencies:
// - Signals and board state from ~/state/gameState
// - Utility methods from ~/pixi/utils
// - Core highlight and getPieceAt functions

import { getPieceAt } from '~/pixi/utils';
import { setPieces } from '~/state/gameState';
import { highlightMoves as highlightKnightMoves } from '~/pixi/pieces/basic/Knight';

/**
 * Highlights valid GhostKnight moves (L-shaped Knight jumps).
 * @param {Object} ghostKnight - The GhostKnight piece.
 * @param {Function} addHighlight - Function to push highlight objects.
 * @param {Array} allPieces - All current board pieces.
 */
export function highlightMoves(ghostKnight, addHighlight, allPieces) {
    highlightKnightMoves(ghostKnight, addHighlight, allPieces);
}

/**
 * Applies GhostKnight stun effect after movement.
 * If the moving piece is not a GhostKnight, does nothing.
 *
 * @param {Object} movedPiece - The piece that just moved (with updated row/col).
 * @param {Array} currentPieces - The full board state after the move.
 */
export function applyStunEffect(movedPiece, currentPieces) {
    if (movedPiece.type !== "GhostKnight") return;
  
    const updatedPieces = [...currentPieces];
    const adjacentOffsets = [
      { dx: -1, dy: -1 }, { dx: -1, dy: 0 }, { dx: -1, dy: 1 },
      { dx: 0, dy: -1 },                   { dx: 0, dy: 1 },
      { dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 },
    ];
  
    for (const { dx, dy } of adjacentOffsets) {
      const row = movedPiece.row + dy;
      const col = movedPiece.col + dx;
  
      if (row < 0 || row >= 8 || col < 0 || col >= 8) continue;
  
      const target = getPieceAt({ row, col }, updatedPieces);
      if (target && target.color !== movedPiece.color) {
        target.stunned = true;
      }
    }
  
    setPieces(updatedPieces);
  }