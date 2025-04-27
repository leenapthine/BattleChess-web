// Description: Logic module for the GhoulKing piece, a level 2 King from the Necromancer Guild.
//
// Main Functions:
// - highlightMoves(ghoulKing, addHighlight, allPieces):
//     Highlights all valid movement tiles for the GhoulKing using standard King movement.
//
// Special Features or Notes:
// - The GhoulKing is a custom level 2 King piece unique to the Necromancer Guild.
// - It moves one square in any direction (standard King movement).
// - It can capture enemy pieces by moving into their square.
// - Once per game, *before* moving, the GhoulKing can raise a NecroPawn on any adjacent unoccupied tile.
// - The raise ability is triggered by clicking the GhoulKing a second time while selected, which highlights
//   adjacent unoccupied tiles in cyan.
// - Clicking one of these highlighted tiles places a new NecroPawn of the same color and consumes the raise ability.
// - The GhoulKing starts with `raisesLeft = 1`. After raising a pawn, this is set to 0.
// - The raise action does **not** count as a move and can be performed in addition to movement or capture.
//
// Usage or Context:
// - This file integrates with the PixiJS board renderer and click handler. Movement logic is delegated to the
//   standard King movement module, while raise logic is implemented in `handleGhoulKingClick.js`.

import { highlightMoves as highlightKingMoves } from '~/pixi/pieces/basic/King';

/**
 * Highlights valid GhoulKing moves
 * @param {Object} ghoulKing - The GhoulKing piece.
 * @param {Function} addHighlight - Function to push highlight objects.
 * @param {Array} allPieces - All current board pieces.
 */
export function highlightMoves(ghoulKing, addHighlight, allPieces) {
    highlightKingMoves(ghoulKing, addHighlight, allPieces);
}