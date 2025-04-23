// Filename: beastDruid.js
// Description: Logic module for the BeastDruid, a level 2 Bishop from the BeastMaster Guild.
//
// Main Functions:
// - highlightMoves(beastDruid, addHighlight, allPieces):
//     Highlights all valid movement and capture tiles for the BeastDruid,
//     combining diagonal Bishop movement and 1-tile perimeter King movement.
//
// Special Features:
// - The BeastDruid is a level 2 Bishop-type unit that belongs to the BeastMaster Guild.
// - It inherits full Bishop movement (unlimited diagonal range, path must be clear).
// - It also inherits full King movement (one square in any direction).
// - Like all units, it captures by moving into a tile occupied by an enemy unit.
// - Highlighted tiles are yellow for movement and red for capture.
// - Movement is blocked by friendly units and blocked paths.
//
// Usage or Context:
// - This logic module is plugged into the PixiJS board renderer to determine highlightable tiles.
// - Movement legality is reused from base Bishop and King logic using shared highlight methods.

import { highlightMoves as highlightKingMoves } from '~/pixi/pieces/basic/King';
import { highlightMoves as highlightBishopMoves } from '~/pixi/pieces/basic/Bishop';

/**
 * Highlights all valid moves for the BeastDruid.
 * Combines Bishop (diagonal) and King (1-tile perimeter) logic.
 * @param {Object} beastDruid - The BeastDruid piece.
 * @param {Function} addHighlight - Function to add highlight tiles.
 * @param {Array} allPieces - Current pieces on the board.
 */
export function highlightMoves(beastDruid, addHighlight, allPieces) {
  highlightBishopMoves(beastDruid, addHighlight, allPieces);
  highlightKingMoves(beastDruid, addHighlight, allPieces);
}
