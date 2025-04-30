// Description: Logic module for the WizardTower, a level 2 Bishop from the Wizard race.
//
// Main Functions:
// - highlightMoves(wizardTower, addHighlight, allPieces):
//     Highlights all valid diagonal movement options (like a regular Bishop).
// - handleWizardTowerCapture(row, col, pixiApp):
//     Handles the capture logic where the WizardTower shoots an enemy piece from a distance.
//
// Special Features:
// - Moves and captures like a Bishop (diagonal movement and capture).
// - Captures by shooting from a distance without moving into the captured square.

import { highlightMoves as highlightStandardBishopMoves } from '~/pixi/pieces/basic/Bishop'; // Import standard bishop highlighting logic
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import { pieces, selectedSquare, setSelectedSquare, setPieces, setHighlights } from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Highlights all valid moves for the WizardTower piece.
 * Inherits standard bishop behavior with diagonal movement.
 *
 * @param {Object} wizardTower - The WizardTower piece being selected.
 * @param {Function} addHighlight - Callback used to push highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(wizardTower, addHighlight, allPieces) {
  highlightStandardBishopMoves(wizardTower, addHighlight, allPieces);
}

/**
 * Handles the logic when the WizardTower attempts to capture an opponent piece.
 * The WizardTower captures by "shooting" an enemy piece from a distance without moving into the space.
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export function handleWizardTowerCapture(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const wizardTowerPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;

  // Ensure the selected piece is a WizardTower
  if (!wizardTowerPiece || wizardTowerPiece.type !== 'WizardTower') return false;

  // Check if the clicked piece is a valid target for capture
  const pieceAtTarget = getPieceAt({ row, col }, currentPieces);

  // Perform the capture if there is an opponent piece at the target position
  if (pieceAtTarget && pieceAtTarget.color !== wizardTowerPiece.color) {
    // Capture the opponent piece by removing it without moving the WizardTower
    const updatedBoard = handleCapture(pieceAtTarget, currentPieces);
    setPieces(updatedBoard);
    setSelectedSquare(null);
    setHighlights([]);
    drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  return false;
}
