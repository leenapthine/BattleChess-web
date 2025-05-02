// Filename: WizardKing.js
// Description: Logic module for the WizardKing, a level 2 King from the Wizard race.
//
// Main Functions:
// - highlightMoves(wizardKing, addHighlight, allPieces):
//     Highlights valid king movement options (standard 1-square movement + vertical line-of-sight).
// - handleWizardKingCapture(row, col, pixiApp):
//     Handles capture logic, including normal king capture and vertical line-of-sight shooting capture.
//
// Special Features:
// - Moves like a regular King (one square in any direction).
// - Can shoot an enemy piece directly ahead in its vertical line of sight (without moving into the space).
// - Can capture in its normal 1-square perimeter (like a regular King), but in this case, it moves into the square.

import { highlightMoves as highlightStandardKingMoves } from '~/pixi/pieces/basic/King'; // Import standard king highlighting logic
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import { pieces, selectedSquare, currentTurn, setSelectedSquare, setPieces, setHighlights } from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Highlights all valid moves for the WizardKing piece.
 * Inherits standard king movement and adds vertical line-of-sight shooting capture.
 *
 * @param {Object} wizardKing - The WizardKing piece being selected.
 * @param {Function} addHighlight - Callback to add highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(wizardKing, addHighlight, allPieces) {
  // Highlight standard king behavior (1-square movement)
  highlightStandardKingMoves(wizardKing, addHighlight, allPieces);

  // Highlight vertical line of sight for capture
  highlightVerticalCapture(wizardKing, addHighlight, allPieces);
}

/**
 * Highlights the vertical line of sight for the WizardKing's capture ability.
 * It highlights the first enemy piece in the vertical line of sight (upward and downward) if unobstructed.
 *
 * @param {Object} wizardKing - The WizardKing piece.
 * @param {Function} addHighlight - Callback to add highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
function highlightVerticalCapture(wizardKing, addHighlight, allPieces) {
  const directionUp = -1; // Upward direction
  const directionDown = 1; // Downward direction
  const column = wizardKing.col;

  // Get current turn directly from the signal
  const isOpponentTurn = wizardKing.color !== currentTurn();
  
  // Check vertical line upwards
  let currentRow = wizardKing.row + directionUp;
  while (currentRow >= 0) {
    const pieceAtPos = getPieceAt({ row: currentRow, col: column }, allPieces);
    if (pieceAtPos) {
      if (pieceAtPos.color !== wizardKing.color) {
        addHighlight(currentRow, column, isOpponentTurn ? 0xe5e4e2 : 0xff0000); // Highlight the first enemy piece in the column (upward)
      }
      break; // Stop at the first piece (no shooting through pieces)
    }
    currentRow += directionUp; // Continue moving up if no piece found
  }

  // Check vertical line downwards
  currentRow = wizardKing.row + directionDown;
  while (currentRow < 8) { // Assuming an 8x8 board
    const pieceAtPos = getPieceAt({ row: currentRow, col: column }, allPieces);
    if (pieceAtPos) {
      if (pieceAtPos.color !== wizardKing.color) {
        addHighlight(currentRow, column, isOpponentTurn ? 0xe5e4e2 : 0xff0000); // Highlight the first enemy piece in the column (downward)
      }
      break; // Stop at the first piece (no shooting through pieces)
    }
    currentRow += directionDown; // Continue moving down if no piece found
  }
}

/**
 * Handles the capture logic for the WizardKing.
 * It performs a normal king capture (moves into the square) or a vertical line-of-sight capture.
 *
 * @param {number} row - Row of the clicked square.
 * @param {number} col - Column of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export function handleWizardKingCapture(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const wizardKingPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const targetPiece = getPieceAt({ row, col }, currentPieces);

  if (!wizardKingPiece || wizardKingPiece.type !== 'WizardKing') return false;

  // Perform normal king capture (1-square perimeter) if clicked piece is in range
  if (targetPiece && Math.abs(targetPiece.row - wizardKingPiece.row) <= 1 && Math.abs(targetPiece.col - wizardKingPiece.col) <= 1) {
    // Ensure that the WizardKing cannot capture itself
    if (targetPiece === wizardKingPiece) return false;    
    const updatedBoard = handleCapture(targetPiece, currentPieces);
    
    // Move the WizardKing to the captured piece's position
    wizardKingPiece.row = targetPiece.row;
    wizardKingPiece.col = targetPiece.col;
    
    setPieces(updatedBoard);    
    setSelectedSquare(null);
    setHighlights([]);    
    drawBoard(pixiApp, handleSquareClick);
    
    return true;  // Indicate the capture was successful
  }

  // Perform vertical line-of-sight capture if an enemy piece is in line of sight
  const directionUp = -1; // Upward direction
  const directionDown = 1; // Downward direction
  const column = wizardKingPiece.col;
  
  // Check vertical line upwards
  let currentRow = wizardKingPiece.row + directionUp;
  while (currentRow >= 0) {
    const pieceAtPos = getPieceAt({ row: currentRow, col: column }, currentPieces);
    if (pieceAtPos) {
      if (targetPiece && pieceAtPos.color !== wizardKingPiece.color && pieceAtPos !== wizardKingPiece) {
        const updatedBoard = handleCapture(pieceAtPos, currentPieces); // Capture piece at target
        setPieces(updatedBoard);
        setSelectedSquare(null);
        setHighlights([]);
        drawBoard(pixiApp, handleSquareClick);
        return true;
      }
      break; // Stop if a friendly piece is encountered or the WizardKing itself is targeted
    }
    currentRow += directionUp;
  }

  // Check vertical line downwards
  currentRow = wizardKingPiece.row + directionDown;
  while (currentRow < 8) {
    const pieceAtPos = getPieceAt({ row: currentRow, col: column }, currentPieces);
    if (pieceAtPos) {
      if (targetPiece && pieceAtPos.color !== wizardKingPiece.color && pieceAtPos !== wizardKingPiece) {
        const updatedBoard = handleCapture(pieceAtPos, currentPieces); // Capture piece at target
        setPieces(updatedBoard);
        setSelectedSquare(null);
        setHighlights([]);
        drawBoard(pixiApp, handleSquareClick);
        return true;
      }
      break; // Stop if a friendly piece is encountered or the WizardKing itself is targeted
    }
    currentRow += directionDown;
  }

  return false;
}
