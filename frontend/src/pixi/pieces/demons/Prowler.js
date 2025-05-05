// Description: Logic module for the Prowler piece, a level 2 Knight from the Demons Guild.
//
// Main Functions:
// - highlightMoves(prowler, addHighlight, allPieces):
//     Highlights valid movement options for the Prowler using standard Knight movement (L-shape).
// - handleProwlerCapture(row, col, pixiApp):
//     Handles the capture logic for the Prowler piece. When the Prowler captures an enemy piece, it 
//     is required to move again. The second move can be any valid Knight move, including returning 
//     to the original position. The second move is highlighted after a capture.
//
// Special Features or Notes:
// - The Prowler moves like a standard Knight, with L-shaped movement (2 squares in one direction and 
//   1 square perpendicular to it).
// - When the Prowler captures an enemy piece, it performs a second move after the capture.
// - The second move will not be allowed until the first move (after capture) is completed.
//
// Usage or Context:
// - This file integrates with the PixiJS board renderer and click handler. Movement logic is based on the standard 
//   Knight movement module, with special handling for the second move after a capture, implemented in 
//   `handleProwlerCapture.js`. 

import { highlightMoves as highlightStandardKnightMoves } from '~/pixi/pieces/basic/Knight';
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import {
  pieces,
  selectedSquare,
  setSelectedSquare,
  setPieces,
  setHighlights,
  isSecondMove,
  setIsSecondMove,
  switchTurn,
  setSelectedPiece,
  selectedPiece
} from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Highlights all valid moves for the Prowler piece.
 * Inherits standard knight behavior with diagonal movement.
 *
 * @param {Object} hellPawn - The Prowler piece being selected.
 * @param {Function} addHighlight - Callback used to push highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(prowler, addHighlight, allPieces) {
  highlightStandardKnightMoves(prowler, addHighlight, allPieces);
}

/**
 * Handles the logic when the Prowler attempts to capture an opponent piece.
 * The Prowler captures an enemy piece and gains the movement ability from its base class.
 * After a capture, the Prowler must move one more time (can move back to the original square).
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export async function handleProwlerCapture(row, col, pixiApp, isTurn) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const prowlerPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const targetPiece = getPieceAt({ row, col }, currentPieces);

  // Ensure the selected piece is a Prowler and it's not clicking on itself
  if (!prowlerPiece || prowlerPiece.type !== 'Prowler' || targetPiece === prowlerPiece || !isTurn) return false;

  // Check if the Prowler is in the middle of a second move
  if (isSecondMove()) {
    setIsSecondMove(false);
    switchTurn();
    handleCapture(selectedPiece(), currentPieces);
    setSelectedPiece(null);
    return false;
  }

  // Check if the target piece is an enemy piece
  if (targetPiece && targetPiece.color !== prowlerPiece.color && targetPiece.type) {

    if (targetPiece.type === 'QueenOfDestruction') {
      switchTurn();
      const remainingPieces = handleCapture(targetPiece, currentPieces, prowlerPiece);
      setPieces(remainingPieces);
      return false;
    }

    // set second move to true
    setIsSecondMove(true);

    setSelectedPiece(targetPiece);

    // Update the pieces without the captured piece
    let updatedPieces = currentPieces.filter(piece => piece.id !== targetPiece.id);
    setPieces(updatedPieces);

    // Move the Prowler to the captured piece's square
    prowlerPiece.row = row;
    prowlerPiece.col = col;

    setSelectedSquare({ row, col });
    setHighlights([]);

    // Now highlight the second move for the Prowler
    const highlightList = [];
    highlightStandardKnightMoves(prowlerPiece, (highlightRow, highlightCol, color) => {
        highlightList.push({ row: highlightRow, col: highlightCol, color });
    }, updatedPieces);

    setHighlights(highlightList);
    drawBoard(pixiApp, handleSquareClick);

    return true;
  }

  return false;
}