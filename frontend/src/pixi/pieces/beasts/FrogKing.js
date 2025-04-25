// Description: Logic module for the FrogKing, a level 2 King from the BeastMaster Guild.
//
// Main Functions:
// - highlightMoves(frogKing, addHighlight, allPieces):
//     Highlights all legal moves for the FrogKing, including standard King movement and extended orthogonal hops.
//
// Special Features:
// - The FrogKing can move one square in any direction (like a standard King).
// - It can also hop two squares orthogonally (up/down/left/right), ignoring intervening pieces.
// - It captures by moving into a square occupied by an enemy unit.
// - Hop movement allows capturing — it is not just evasive or positioning.
// - Cannot hop diagonally.
// - Does not support castling or other King-specific rules.
// - Designed as a level 2 King from the BeastMaster faction.
//
// Usage:
// - Import and use `highlightMoves` when this piece is selected to generate its valid move targets.

import { getPieceAt } from '~/pixi/utils';
import { highlightMoves as highlightKingMoves } from '~/pixi/pieces/basic/King';

/**
 * Highlights all valid movement and capture tiles for the FrogKing.
 * Combines standard King movement with extended 2-tile orthogonal hops.
 *
 * @param {Object} frogKing - The FrogKing piece object.
 * @param {Function} addHighlight - Function used to add a highlight (row, col, optional color).
 * @param {Array} allPieces - All current game pieces on the board.
 */
export function highlightMoves(frogKing, addHighlight, allPieces) {
    // Step 1: Normal King movement
    highlightKingMoves(frogKing, addHighlight, allPieces);
  
    // Step 2: Add 2-tile orthogonal hops
    const hopOffsets = [
      { rowOffset: 2, colOffset: 0 },
      { rowOffset: -2, colOffset: 0 },
      { rowOffset: 0, colOffset: 2 },
      { rowOffset: 0, colOffset: -2 }
    ];
  
    for (const { rowOffset, colOffset } of hopOffsets) {
      const targetRow = frogKing.row + rowOffset;
      const targetCol = frogKing.col + colOffset;
  
      // Stay within bounds
      if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) continue;
  
      const targetPiece = getPieceAt({ row: targetRow, col: targetCol }, allPieces);
  
      // Skip if occupied by a friendly piece
      if (targetPiece && targetPiece.color === frogKing.color) continue;
  
      // Highlight enemy targets in red, empty squares default color
      const color = targetPiece ? 0xff0000 : undefined;
      addHighlight(targetRow, targetCol, color);
    }
  }
  