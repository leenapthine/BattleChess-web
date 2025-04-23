// Filename: beastKnight.js
// Description: Logic module for the BeastKnight piece, a level 2 Knight from the BeastMaster Guild.
//
// Main Functions:
// - highlightMoves(beastKnight, addHighlight, allPieces):
//     Highlights all valid movement and capture tiles for the BeastKnight.
//
// Special Features:
// - Moves in an extended L-shape: 3 squares in one direction and 1 in the other (3/1 or 1/3).
// - Ignores intervening pieces; only cares about the destination.
// - Captures by landing on an enemy unit.
//
// Usage:
// - Used by the PixiJS board renderer to determine valid tiles when a BeastKnight is selected.

import { getPieceAt } from '~/pixi/utils';

/**
 * Highlights all valid moves for the BeastKnight.
 * Extended L-shaped logic: (3,1) and (1,3) movement.
 *
 * @param {Object} beastKnight - The piece to evaluate.
 * @param {Function} addHighlight - Function to add highlights.
 * @param {Array} allPieces - Current state of the board.
 */
export function highlightMoves(beastKnight, addHighlight, allPieces) {
  const { row, col, color } = beastKnight;

  // All 8 possible BeastKnight L-shaped moves
  const moveOffsets = [
    { dRow: 3, dCol: 1 },
    { dRow: 3, dCol: -1 },
    { dRow: -3, dCol: 1 },
    { dRow: -3, dCol: -1 },
    { dRow: 1, dCol: 3 },
    { dRow: 1, dCol: -3 },
    { dRow: -1, dCol: 3 },
    { dRow: -1, dCol: -3 },
  ];

  for (const { dRow, dCol } of moveOffsets) {
    const targetRow = row + dRow;
    const targetCol = col + dCol;

    // Board bounds check
    if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) continue;

    const targetPiece = getPieceAt({ row: targetRow, col: targetCol }, allPieces);

    if (!targetPiece) {
      addHighlight(targetRow, targetCol); // Standard move
    } else if (targetPiece.color !== color) {
      addHighlight(targetRow, targetCol, 0xff0000); // Capture
    }
  }
}
