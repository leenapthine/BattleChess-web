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

import { highlightMoves as highlightRookMoves } from '~/pixi/pieces/basic/Rook';
import { launchMode, isInLoadingMode } from '~/state/gameState';
import { getAdjacentTiles } from '../../utils';

/**
 * Highlights DeadLauncher movement, loading, and launch capture zones.
 *
 * @param {Object} piece - The DeadLauncher piece.
 * @param {Function} addHighlight - Function to register highlighted tiles.
 * @param {Array} allPieces - All current board pieces.
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const isInLaunchMode = launchMode()?.id === piece.id;
  const isPawnLoaded = piece.pawnLoaded === true;
  const row = piece.row;
	const col = piece.col;
  
  // highlight self in cyan
  addHighlight(row, col, 0x00ffff);

  // Step 2: Loading mode - highlight adjacent squares in cyan
  if (isInLoadingMode() && !isPawnLoaded) {
    const adjacentTiles = getAdjacentTiles(piece);
    for (const tile of adjacentTiles) {
      addHighlight(tile.row, tile.col, 0x00ffff);
    }
    return;
  }

  // Step 5: Launch mode - highlight 3-distance Manhattan perimeter tiles in red
  if (isInLaunchMode && isPawnLoaded) {
    const launchTiles = getLaunchTargets(piece);
    for (const tile of launchTiles) {
      addHighlight(tile.row, tile.col, 0xff0000);
    }
    return;
  }

  // Step 1 or 4: Normal rook movement and captures
  if (!isInLoadingMode() && !isInLaunchMode) {
    highlightRookMoves(piece, addHighlight, allPieces);
  }
}

/**
 * Returns all tiles on the exact Manhattan perimeter distance of 3.
 * Used for DeadLauncher red highlighting in launch mode.
 *
 * @param {Object} piece - The DeadLauncher.
 * @returns {Array} List of tile positions exactly 3 tiles away.
 */
export function getLaunchTargets(piece) {
  const captureTiles = [];

  for (let dx = -3; dx <= 3; dx++) {
    for (let dy = -3; dy <= 3; dy++) {
      const manhattanDistance = Math.abs(dx) + Math.abs(dy);
      const targetRow = piece.row + dy;
      const targetCol = piece.col + dx;

      if (
        manhattanDistance === 3 &&
        targetRow >= 0 && targetRow < 8 &&
        targetCol >= 0 && targetCol < 8
      ) {
        captureTiles.push({ row: targetRow, col: targetCol });
      }
    }
  }

  return captureTiles;
}


