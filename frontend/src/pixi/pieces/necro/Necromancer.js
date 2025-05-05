// Description:
// This file defines the **Necromancer**, a special unit in the Battle Chess game.
//
// Overview:
// - The Necromancer is a Level 2 unit that inherits the diagonal movement of a Bishop.
// - It belongs to the **Necromancer Race**, a powerful faction of spellcasters and undead manipulators.
// - In addition to standard diagonal movement, the Necromancer possesses a **Raise Dead** ability.
//
// Special Ability – Raise Dead:
// - Upon **capturing** an enemy piece, the Necromancer can raise a new **Pawn** from the dead.
// - After a successful capture, **adjacent empty squares** around the captured location will be highlighted.
// - The player can **click on any highlighted square** to place a resurrected Pawn of the Necromancer's color.
// - This ability only works immediately after the capture and only if at least one adjacent square is available.
//
// Usage:
// - This logic is integrated with the piece highlighter and click handler modules.
// - The piece is fully playable in the current system and behaves like a Bishop until a capture occurs.

import { getPieceAt } from '~/pixi/utils';
import { setResurrectionTargets, setPendingResurrectionColor } from '~/state/gameState';
import { highlightMoves as highlightStandardBishopMoves } from '../basic/Bishop';

/**
 * Highlights all valid diagonal movement and capture positions for the Necromancer.
 *
 * - Movement is restricted to unobstructed diagonals.
 * - Capturable enemy pieces are highlighted in red.
 *
 * @param {Object} piece - The Necromancer piece to evaluate.
 * @param {Function} addHighlight - Callback to register a highlight square.
 * @param {Array} allPieces - Current list of active game pieces.
 */
export function highlightMoves(necromancer, addHighlight, allPieces) {
  // Highlight standard Bishop moves
  highlightStandardBishopMoves(necromancer, addHighlight, allPieces);
}

/**
 * Triggers resurrection mode by highlighting empty adjacent squares.
 *
 * This is called after the Necromancer captures a piece. All orthogonally adjacent
 * and unoccupied squares are highlighted in blue, allowing the player to place
 * a resurrected Pawn of the same color as the Necromancer.
 *
 * @param {{ row: number, col: number }} position - The location of the captured piece.
 * @param {Array} allPieces - Current list of active game pieces.
 * @param {string} color - The color of the Necromancer ('White' or 'Black').
 */
export function highlightRaiseDeadTiles(position, allPieces, color) {
  const offsets = [
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
    { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
  ];

  const targets = offsets
    .map(({ dx, dy }) => ({ row: position.row + dy, col: position.col + dx }))
    .filter(pos =>
      pos.row >= 0 && pos.row < 8 &&
      pos.col >= 0 && pos.col < 8 &&
      !getPieceAt(pos, allPieces)
    );

  setResurrectionTargets(targets);
  setPendingResurrectionColor(color);
}
