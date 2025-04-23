// Filename: boulderThrower.js
// Description: Logic module for the BoulderThrower, a level 2 Rook from the BeastMaster Guild.
//
// Main Functions:
// - highlightMoves(boulderThrower, addHighlight, allPieces):
//     Highlights straight-line movement options (non-capture).
// - highlightCaptureZones(boulderThrower, addHighlight, allPieces):
//     Highlights tiles exactly 3 tiles away where the unit can throw a boulder to capture.
// - handleBoulderThrowerClick(row, col, pixiApp):
//     Manages interaction logic for selecting, toggling to launch mode, and executing a capture.
//
// Special Features:
// - Cannot capture via movement.
// - Captures are performed from a distance via a launch ability, targeting any enemy piece exactly 3 tiles away.
// - Clicking the unit once highlights normal movement; clicking it again toggles launch mode.

import { getPieceAt } from '~/pixi/utils';
import {
  selectedSquare,
  setSelectedSquare,
  pieces,
  setPieces,
  setHighlights,
  isInBoulderMode,
  setIsInBoulderMode
} from '~/state/gameState';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';

/**
 * Highlights legal movement tiles for the BoulderThrower.
 * Movement is rook-style but cannot pass through or land on occupied squares.
 *
 * @param {Object} boulderThrower - The piece currently being evaluated.
 * @param {Function} addHighlight - Function to collect highlight targets.
 * @param {Array} allPieces - Current pieces on the board.
 */
export function highlightMoves(boulderThrower, addHighlight, allPieces) {
  const { row: originRow, col: originCol } = boulderThrower;
  const directions = [
    { deltaRow: 1, deltaCol: 0 },
    { deltaRow: -1, deltaCol: 0 },
    { deltaRow: 0, deltaCol: 1 },
    { deltaRow: 0, deltaCol: -1 }
  ];

  for (const { deltaRow, deltaCol } of directions) {
    for (let step = 1; step < 8; step++) {
      const targetRow = originRow + deltaRow * step;
      const targetCol = originCol + deltaCol * step;

      if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) break;
      const occupied = getPieceAt({ row: targetRow, col: targetCol }, allPieces);
      if (occupied) break;

      addHighlight(targetRow, targetCol);
    }
  }
}

/**
 * Highlights tiles exactly 3 tiles away (Manhattan distance) where the BoulderThrower can throw a boulder.
 *
 * @param {Object} boulderThrower - The piece currently being evaluated.
 * @param {Function} addHighlight - Function to collect highlight targets.
 * @param {Array} allPieces - Current pieces on the board.
 */
export function highlightCaptureZones(boulderThrower, addHighlight, allPieces) {
  const { row: originRow, col: originCol } = boulderThrower;
  const offsets = [
    [3, 0], [2, 1], [1, 2], [0, 3],
    [-3, 0], [-2, -1], [-1, -2], [0, -3],
    [-2, 1], [-1, 2], [1, -2], [2, -1]
  ];

  for (const [deltaRow, deltaCol] of offsets) {
    const targetRow = originRow + deltaRow;
    const targetCol = originCol + deltaCol;
    if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
      addHighlight(targetRow, targetCol, 0xff0000);
    }
  }
}

/**
 * Handles BoulderThrower-specific interactions including selection, launch mode toggling, and ranged captures.
 *
 * @param {number} row - Clicked row.
 * @param {number} col - Clicked column.
 * @param {PIXI.Application} pixiApp - PixiJS app instance.
 * @returns {Promise<boolean>} - Whether the click was handled by this logic.
 */
export async function handleBoulderThrowerClick(row, col, pixiApp) {
  const currentPieces = pieces();
  const clickedPiece = getPieceAt({ row, col }, currentPieces);
  const currentSelection = selectedSquare();
  const selectedPiece = currentSelection ? getPieceAt(currentSelection, currentPieces) : null;

  // === Step 1: Launch capture logic
  if (selectedPiece && selectedPiece.type === 'BoulderThrower' && isInBoulderMode()) {
    const targetPiece = getPieceAt({ row, col }, currentPieces);
    const manhattanDistance = Math.abs(row - currentSelection.row) + Math.abs(col - currentSelection.col);

    if (targetPiece && targetPiece.color !== selectedPiece.color && manhattanDistance === 3) {
      setPieces(currentPieces.filter(p => !(p.row === row && p.col === col)));
      setSelectedSquare(null);
      setHighlights([]);
      setIsInBoulderMode(false);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }
  }

  // === Step 2: Toggle launch mode on second click
  if (
    selectedPiece &&
    selectedPiece.row === row &&
    selectedPiece.col === col &&
    selectedPiece.type === 'BoulderThrower'
  ) {
    const launchTargets = [];
    highlightCaptureZones(selectedPiece, (highlightRow, highlightCol, color) => {
      launchTargets.push({ row: highlightRow, col: highlightCol, color });
    }, currentPieces);

    launchTargets.push({ row, col, color: 0x00ffff });
    setHighlights(launchTargets);
    setIsInBoulderMode(true);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  // === Step 3: Initial selection of BoulderThrower
  if (clickedPiece && clickedPiece.type === 'BoulderThrower') {
    setIsInBoulderMode(false);
    setSelectedSquare({ row, col });

    const moveTargets = [];
    highlightMoves(clickedPiece, (highlightRow, highlightCol, color) => {
      moveTargets.push({ row: highlightRow, col: highlightCol, color });
    }, currentPieces);

    moveTargets.push({ row, col, color: 0x00ffff });
    setHighlights(moveTargets);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  // === Step 4: Clicked elsewhere — deselect
  setIsInBoulderMode(false);
  return false;
}
