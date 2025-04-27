// Filename: QueenOfIllusions.js
// Description: Logic module for the Queen of Illusions, a level 2 Queen from the Wizard race.
//
// Main Functions:
// - highlightMoves(queenOfIllusions, addHighlight, allPieces):
//     Highlights valid queen movement options (straight and diagonal).
// - highlightSwapTargets(queenOfIllusions, addHighlight, allPieces):
//     Highlights all friendly Pawns and YoungWiz pieces in cyan, which are eligible for swapping.
// - handleQueenOfIllusionsSwap(row, col, pixiApp):
//     Handles the swap logic between the Queen of Illusions and a selected friendly Pawn/YoungWiz.
//
// Special Features:
// - The Queen of Illusions moves like a regular Queen (straight and diagonal).
// - On the first click, highlights all valid moves and friendly Pawns/YoungWiz in cyan.
// - On the second click on a friendly Pawn/YoungWiz, swaps their position with the Queen of Illusions.

import { highlightMoves as highlightStandardQueenMoves } from '~/pixi/pieces/basic/Queen'; // Import standard queen highlighting logic
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import { pieces, selectedSquare, setSelectedSquare, setPieces, setHighlights } from '~/state/gameState';

/**
 * Highlights valid queen movement options and friendly pieces eligible for swap.
 *
 * @param {Object} queenOfIllusions - The Queen of Illusions piece.
 * @param {Function} addHighlight - Callback to add highlight tiles.
 * @param {Array} allPieces - All the pieces currently on the board.
 */
export function highlightMoves(queenOfIllusions, addHighlight, allPieces) {
  // Highlight standard queen movement (straight and diagonal)
  highlightStandardQueenMoves(queenOfIllusions, addHighlight, allPieces);

  // Highlight friendly Pawns and YoungWiz pieces eligible for swap (cyan)
  highlightSwapTargets(queenOfIllusions, addHighlight, allPieces);
}

/**
 * Highlights friendly Pawns and YoungWiz pieces in cyan, indicating they are eligible for swapping.
 *
 * @param {Object} queenOfIllusions - The Queen of Illusions piece.
 * @param {Function} addHighlight - Callback to add highlight tiles.
 * @param {Array} allPieces - All the pieces currently on the board.
 */
export function highlightSwapTargets(queenOfIllusions, addHighlight, allPieces) {
  // Find all friendly Pawns and YoungWiz pieces
  const friendlyPieces = allPieces.filter(piece =>
    (piece.color === queenOfIllusions.color) &&
    (piece.type === 'Pawn' || piece.type === 'YoungWiz')
  );

  // Highlight these friendly pieces
  friendlyPieces.forEach(piece => {
    addHighlight(piece.row, piece.col, 0x00FFFF); // Cyan color for eligible swap targets
  });
}

/**
 * Handles the swap logic when a friendly Pawn or YoungWiz is clicked.
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if the swap was performed, false otherwise.
 */
export function handleQueenOfIllusionsSwap(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const queenPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const clickedPiece = getPieceAt({ row, col }, currentPieces);

  if (!queenPiece || queenPiece.type !== 'QueenOfIllusions') return false;

  // Ensure the clicked piece is a friendly Pawn or YoungWiz
  if (clickedPiece && (clickedPiece.type === 'Pawn' || clickedPiece.type === 'YoungWiz') && clickedPiece.color === queenPiece.color) {
    // Swap the positions of the Queen of Illusions and the clicked piece
    const tempRow = queenPiece.row;
    const tempCol = queenPiece.col;
    
    // Move the clicked piece to the Queen's position
    clickedPiece.row = tempRow;
    clickedPiece.col = tempCol;

    // Move the Queen to the clicked piece's position
    queenPiece.row = row;
    queenPiece.col = col;

    // Update the board with the swapped positions
    setPieces([...currentPieces]);
    setSelectedSquare(null);
    setHighlights([]);
    drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  return false;
}
