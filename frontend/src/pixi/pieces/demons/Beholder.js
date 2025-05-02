// Description: Implementation of the Beholder class, a level 2 piece from the Demon race in Battle Chess.
// 
// Main Classes:
// - Beholder: Defines the behavior, movement, and capture rules for the Beholder piece on the chessboard. 
//   The Beholder has the ability to move one step forward, backward, or sideways and can capture pieces by throwing boulders at them.
//
// Main Functions:
// - highlightMoves(beholder, addHighlight, allPieces): Highlights all valid moves for the Beholder piece, which can move one square 
//   forward, backward, or sideways. It avoids moving into occupied spaces unless capturing an opponent's piece.
// - highlightCaptureZones(beholder, addHighlight, allPieces): Highlights all squares within a 3-tile Manhattan distance from the Beholder, 
//   where it can throw a boulder and potentially capture an opponent's piece.
// - handleBeholderClick(row, col, pixiApp): Handles the Beholder's capture logic when it is in Boulder mode (i.e., shooting enemies from disctance). 
//   and toggles between movement and capture mode when clicked multiple times.
//
// Special Features or Notes:
// - The Beholder moves one step at a time in any of the four cardinal directions: up, down, left, or right.
// - The Beholder cannot move onto a square occupied by a friendly piece or enemy piece.
// - It can shoot (a capture mechanic) within a 3-tile or 2-tile Manhattan distance, which does not require moving into the enemy piece's square.

import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import {
  pieces,
  selectedSquare,
  setSelectedSquare,
  setPieces,
  setHighlights,
  isInBoulderMode,
  setIsInBoulderMode,
  currentTurn,
} from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Adds highlight markers for all valid Beholder moves.
 * The Beholder moves one step forward, backward, or sideways.
 *
 * @param {Object} beholder - The Beholder piece
 * @param {Function} addHighlight - Callback to register highlight at (row, col, color)
 * @param {Array} allPieces - List of all pieces currently on the board
 */
export function highlightMoves(beholder, addHighlight, allPieces) {
  const { row, col, color } = beholder;
  
  // highlight self in cyan
  addHighlight(row, col, 0x00ffff);

  // Get current turn directly from the signal
  const isOpponentTurn = color !== currentTurn(); // Check if it's the opponent's turn

  // Determine the highlight color based on the turn
  const highlightColor = isOpponentTurn ? 0xe5e4e2 : 0xffff00;

  const directions = [
    { rowOffset: -1, colOffset: 0 },  // up
    { rowOffset: 1, colOffset: 0 },   // down
    { rowOffset: 0, colOffset: -1 },  // left
    { rowOffset: 0, colOffset: 1 },   // right
  ];

  for (const { rowOffset, colOffset } of directions) {
    const targetRow = row + rowOffset;
    const targetCol = col + colOffset;

    // Check if the move is within bounds
    if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) continue;

    const targetPos = { row: targetRow, col: targetCol };
    const targetPiece = getPieceAt(targetPos, allPieces);

    if (!targetPiece) {
      addHighlight(targetRow, targetCol, highlightColor); // yellow for valid move
    }
  }
}

/**
 * Highlights tiles exactly 3 tiles away (Manhattan distance) where the Beholder can throw a boulder.
 *
 * @param {Object} beholder - The piece currently being evaluated.
 * @param {Function} addHighlight - Function to collect highlight targets.
 * @param {Array} allPieces - Current pieces on the board.
 */
export function highlightCaptureZones(beholder, addHighlight, allPieces) {
  const { row: originRow, col: originCol } = beholder;
  const offsets = [
    [3, 0], [2, 1], [1, 2], [0, 3],
    [-3, 0], [-2, -1], [-1, -2], [0, -3],
    [-2, 1], [-1, 2], [1, -2], [2, -1],
    [2, 0], [0, 2], [1, -1], [-1, 1],
    [1, 1], [-1, -1], [0, -2], [-2, 0],
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
 * Handles the logic when the Beholder attempts to capture an opponent piece.
 * The Beholder captures an enemy piece and gains the movement ability from its base class.
 * After a capture, the Beholder must move one more time (can move back to the original square).
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export async function handleBeholderClick(row, col, pixiApp) {
  const currentPieces = pieces();
  const targetPiece = getPieceAt({ row, col }, currentPieces);
  const currentSelection = selectedSquare();
  const selectedPiece = currentSelection ? getPieceAt(currentSelection, currentPieces) : null;

  // === Step 1: Launch capture logic
  if (selectedPiece && selectedPiece.type === 'Beholder' && isInBoulderMode()) {
    if (targetPiece && targetPiece.color !== selectedPiece.color) {
      const captured = getPieceAt({ row, col }, currentPieces);
      const updatedPieces = handleCapture(captured, currentPieces, selectedPiece);
      setPieces(updatedPieces);
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
    selectedPiece.type === 'Beholder' &&
    !isInBoulderMode()
  ) {
    // Get current turn directly from the signal
    const isOpponentTurn = selectedPiece.color !== currentTurn(); // Check if it's the opponent's turn

    // Determine the highlight color based on the turn
    const highlightColor = isOpponentTurn ? 0xe5e4e2 : 0xff0000;

    const launchTargets = [];
    highlightCaptureZones(selectedPiece, (highlightRow, highlightCol) => {
      launchTargets.push({ row: highlightRow, col: highlightCol, color: highlightColor});
    }, currentPieces);

    setHighlights(launchTargets);
    setIsInBoulderMode(true);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  // === Step 4: Clicked elsewhere — deselect
  if (selectedPiece && selectedPiece.type === 'Beholder') {
    setIsInBoulderMode(false);
  }

  return false;
}
