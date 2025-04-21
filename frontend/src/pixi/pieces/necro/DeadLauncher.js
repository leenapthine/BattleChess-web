// Description:
// This file defines the **DeadLauncher**, a special unit in the Battle Chess game.
//
// Overview:
// - The DeadLauncher inherits straight-line movement (like a Rook).
// - It can "load" an adjacent friendly pawn and "launch" it at range to destroy an enemy piece.
// - This launch is a special ranged capture with a cooldown-like behavior.
//
// Special Ability – Pawn Launch:
// - When not loaded, it highlights adjacent friendly pawns (blue). Clicking one loads it.
// - When loaded, the DeadLauncher can toggle into "launch mode".
// - In launch mode, red highlights appear around it (within a 3-tile Manhattan range).
// - Clicking a red tile destroys the enemy there and consumes the pawn.
// - While loaded (but not launching), the DeadLauncher can move normally.

import { getPieceAt } from '~/pixi/utils';
import { launchMode, isInLoadingMode } from '~/state/gameState';

/**
 * Highlights all valid DeadLauncher moves and special ability targets.
 * 
 * Behavior varies depending on state:
 * - Loading mode: highlights adjacent tiles in cyan.
 * - Launch mode: highlights targets in red.
 * - Normal mode: highlights rook-style moves and captures.
 *
 * @param {Object} piece - The DeadLauncher piece object.
 * @param {Function} addHighlight - Function to register highlights.
 * @param {Array} allPieces - All current pieces on the board.
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const inLaunchMode = launchMode()?.id === piece.id;
  const isPawnLoaded = piece.pawnLoaded === true;

  // Step 2: Loading mode - highlight adjacent squares
  if (isInLoadingMode() && !isPawnLoaded) {
    const adjacentTiles = getAdjacentTiles(piece);
    for (const tile of adjacentTiles) {
      addHighlight(tile.row, tile.col, 0x00ffff);
    }
    return;
  }

  // Step 5: Launch mode - highlight enemy targets in red
  if (inLaunchMode && isPawnLoaded) {
    const launchTargets = getLaunchTargets(piece, allPieces);
    for (const target of launchTargets) {
      addHighlight(target.row, target.col, 0xff0000);
    }
    return;
  }

  // Step 1 or 4: Normal rook movement and captures
  if (!isInLoadingMode() && !inLaunchMode) {
    const { moves, captures } = getRookMoves(piece, allPieces);
    for (const move of moves) {
      addHighlight(move.row, move.col, 0xffff00);
    }
    for (const capture of captures) {
      addHighlight(capture.row, capture.col, 0xff0000);
    }
  }
}

/**
 * Returns all orthogonally adjacent tiles to a given piece.
 *
 * @param {Object} piece - The piece to get adjacent tiles for.
 * @returns {Array} List of adjacent positions.
 */
function getAdjacentTiles(piece) {
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];

  return directions
    .map(({ dx, dy }) => ({ row: piece.row + dy, col: piece.col + dx }))
    .filter(pos => pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8);
}

/**
 * Returns all valid rook-style moves and captures for a piece.
 *
 * @param {Object} piece - The piece being evaluated.
 * @param {Array} allPieces - All current board pieces.
 * @returns {{ moves: Array, captures: Array }} List of valid moves and captures.
 */
export function getRookMoves(piece, allPieces) {
  const validMoves = [];
  const validCaptures = [];

  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];

  for (const { dx, dy } of directions) {
    for (let step = 1; step < 8; step++) {
      const newRow = piece.row + dy * step;
      const newCol = piece.col + dx * step;
      if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

      const occupant = getPieceAt({ row: newRow, col: newCol }, allPieces);
      if (!occupant) {
        validMoves.push({ row: newRow, col: newCol });
      } else {
        if (occupant.color !== piece.color) {
          validCaptures.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  }

  return { moves: validMoves, captures: validCaptures };
}

/**
 * Returns all enemy tiles within 3-tile Manhattan range of a DeadLauncher.
 *
 * @param {Object} piece - The DeadLauncher.
 * @param {Array} allPieces - All current board pieces.
 * @returns {Array} List of valid target positions.
 */
export function getLaunchTargets(piece, allPieces) {
  const launchRange = 3;
  const targets = [];

  for (let dx = -launchRange; dx <= launchRange; dx++) {
    for (let dy = -launchRange; dy <= launchRange; dy++) {
      const distance = Math.abs(dx) + Math.abs(dy);
      const targetRow = piece.row + dy;
      const targetCol = piece.col + dx;

      if (
        distance > 0 &&
        distance <= launchRange &&
        targetRow >= 0 && targetRow < 8 &&
        targetCol >= 0 && targetCol < 8
      ) {
        const occupant = getPieceAt({ row: targetRow, col: targetCol }, allPieces);
        if (occupant && occupant.color !== piece.color) {
          targets.push({ row: targetRow, col: targetCol });
        }
      }
    }
  }

  return targets;
}
