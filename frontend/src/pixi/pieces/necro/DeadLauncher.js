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
 * Highlights DeadLauncher movement, loading, and launch capture zones.
 *
 * @param {Object} piece - The DeadLauncher piece.
 * @param {Function} addHighlight - Function to register highlighted tiles.
 * @param {Array} allPieces - All current board pieces.
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const isInLaunchMode = launchMode()?.id === piece.id;
  const isPawnLoaded = piece.pawnLoaded === true;

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
export function getAdjacentTiles(piece) {
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


