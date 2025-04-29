// Filename: Familiar.js
// Description: Logic module for the Familiar, a level 2 Knight from the Wizard race.
//
// Main Functions:
// - highlightMoves(familiar, addHighlight, allPieces):
//     Highlights all valid movement and capture tiles for the Familiar, including turning to stone.
// - handleFamiliarClick(row, col, pixiApp):
//     Manages the turn to stone ability and the regular Knight behavior.
//
// Special Features:
// - Moves like a regular Knight, but can turn to stone and become untouchable.
// - When turned to stone, it cannot be captured. Clicking on it while turned to stone will undo the transformation.

import { highlightMoves as highlightStandardKnightMoves } from '~/pixi/pieces/basic/Knight'; // Import standard Knight highlighting logic
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import { pieces, selectedSquare, setSelectedSquare, setPieces, setHighlights } from '~/state/gameState';

/**
 * Highlights all valid moves for the Familiar piece.
 * Inherits normal Knight behavior and allows turning to stone.
 *
 * @param {Object} familiar - The Familiar piece being selected.
 * @param {Function} addHighlight - Callback to add highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(familiar, addHighlight, allPieces) {
  // If the Familiar is not stone, highlight normal Knight moves and itself in cyan
  if (!familiar.isStone) {
    highlightStandardKnightMoves(familiar, addHighlight, allPieces);
    addHighlight(familiar.row, familiar.col, 0x00FFFF); // Highlight the Familiar in cyan
  } else {
    // If turned to stone, just highlight Knight moves, not itself in cyan
    highlightStandardKnightMoves(familiar, addHighlight, allPieces);
  }
}

/**
 * Handles the Familiar's click behavior.
 * Triggers the turn to stone ability and allows undoing it.
 *
 * @param {number} row - Row of the square clicked.
 * @param {number} col - Column of the square clicked.
 * @param {Object} pixiApp - The PixiJS application instance.
 * @returns {boolean} Returns true if the Familiar's state was toggled (stone/unstone), false otherwise.
 */
export function handleFamiliarClick(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const familiarPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;

  // Check if the selected square corresponds to the Familiar piece's position
  if (
    !familiarPiece || 
    familiarPiece.type !== 'Familiar'
  ) return false;

  if (familiarPiece.row !== row || familiarPiece.col !== col) {
    familiarPiece.isStone = false; 
    return false; // Clicked square does not match the Familiar's position
  }

  // If the Familiar is clicked while it's turned to stone, undo the transformation
  if (familiarPiece.isStone) {
    familiarPiece.isStone = false; // Unstone the Familiar
    setPieces([...currentPieces]); // Update the board with the new state
    setSelectedSquare(null); // Deselect the Familiar
    setHighlights([]); // Clear the highlights
    drawBoard(pixiApp, handleSquareClick); // Redraw the board
    return true; // Successfully unstoned
  }

  // If the Familiar is clicked while not turned to stone, turn it to stone
  familiarPiece.isStone = true; // Turn to stone
  setPieces([...currentPieces]); // Update the board with the new state
  setSelectedSquare(null); // Deselect the Familiar
  setHighlights([]); // Clear the highlights
  drawBoard(pixiApp, handleSquareClick); // Redraw the board
  return true; // Successfully turned to stone
}
