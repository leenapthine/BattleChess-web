/**
 * Description: Implementation of the Queen of Destruction piece, a level 2 Queen from the Demon race.
 * 
 * Main Functions:
 * - highlightMoves: Highlights all valid queen movement options.
 * - triggerDetonate: Detonates an area around the Queen of Destruction, removing enemy pieces within range.
 *
 * Special Features:
 * - Queen of Destruction moves like a regular Queen (straight and diagonal).
 * - Upon being captured, the Queen of Destruction triggers a detonation effect within a 3-tile radius.
 * - Detonation removes all pieces within that radius.
 * 
 * Context:
 * - This file integrates with the PixiJS board renderer and click handler. 
 * Movement and detonation logic are executed based on user interactions.
 */

import { highlightMoves as highlightStandardQueenMoves } from '~/pixi/pieces/basic/Queen';
import { getSurroundingTiles } from '~/pixi/pieces/necro/NecroPawn';
import { getPieceAt } from '~/pixi/utils';

/**
 * Highlights valid queen movement options.
 *
 * @param {Object} queenOfDestruction - The Queen of Destruction piece.
 * @param {Function} addHighlight - Callback to add highlight tiles.
 * @param {Array} allPieces - All the pieces currently on the board.
 */
export function highlightMoves(queenOfDestruction, addHighlight, allPieces) {
  // Highlight standard queen movement
  highlightStandardQueenMoves(queenOfDestruction, addHighlight, allPieces);
}

/**
 * Triggers detonation effect for the Queen of Destruction, removingpieces in the surrounding area.
 * The Queen of Destruction detonates upon being captured.
 *
 * @param {number} row - The row index where the Queen of Destruction is located.
 * @param {number} col - The column index where the Queen of Destruction is located.
 * @param {Array} currentPieces - The full list of pieces on the board before detonation.
 * @returns {Array} The updated list of pieces after detonation (with the removed pieces).
 */
export function triggerDetonate(row, col, currentPieces) {
    const queenPiece = getPieceAt({ row, col }, currentPieces);

    // If there is no Queen of Destruction at the specified position, do nothing
    if (!queenPiece || queenPiece.type !== 'QueenOfDestruction') return currentPieces;

    // Get surrounding tiles
    const surroundingTiles = getSurroundingTiles(row, col);

    // Remove all pieces within the surrounding area
    let updatedPieces = currentPieces.filter(piece => {
        return !surroundingTiles.some(tile => tile.row === piece.row && tile.col === piece.col);
    });

    // Return the updated list of pieces (with the removed pieces)
    return updatedPieces;
}