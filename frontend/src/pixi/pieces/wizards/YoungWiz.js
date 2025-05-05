// Description: Logic module for the YoungWiz, a level 2 pawn from the Wizard race.
//
// Main Functions:
// - highlightMoves(youngWiz, addHighlight, allPieces): Highlights valid movement (standard pawn moves + zap capture).
// - handleYoungWizZapClick(row, col, pixiApp): Manages zap capture logic, capturing an enemy piece directly ahead without moving.
//
// Special Features:
// - The YoungWiz moves forward one square but can move two squares on its first move.
// - Captures diagonally like a regular pawn, but can also zap an enemy piece directly in front of it.

import { highlightMoves as highlightStandardPawnMoves } from '~/pixi/pieces/basic/Pawn';
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import { pieces, selectedSquare, setSelectedSquare, setPieces, setHighlights, currentTurn } from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Highlights all valid moves for the YoungWiz piece, including zap capture.
 *
 * @param {Object} youngWiz - The YoungWiz piece.
 * @param {Function} addHighlight - Callback to add highlighted tiles.
 * @param {Array} allPieces - All pieces on the board.
 */
export function highlightMoves(youngWiz, addHighlight, allPieces) {
  const direction = youngWiz.color === 'White' ? 1 : -1;
  highlightStandardPawnMoves(youngWiz, addHighlight, allPieces);

  // Get current turn directly from the signal
  const isOpponentTurn = youngWiz.color !== currentTurn();

  const zapCapturePosition = { row: youngWiz.row + direction, col: youngWiz.col };
  const pieceAtZap = getPieceAt(zapCapturePosition, allPieces);

  if (pieceAtZap && pieceAtZap.color !== youngWiz.color) {
    addHighlight(zapCapturePosition.row, zapCapturePosition.col, isOpponentTurn ? 0xe5e4e2 : 0xff0000); // Highlight zap capture in red
  }
}

/**
 * Handles zap capture by the YoungWiz.
 * Captures an opponent piece directly ahead without moving.
 *
 * @param {number} row - Row of the clicked square.
 * @param {number} col - Column of the clicked square.
 * @param {Object} pixiApp - The PixiJS app instance.
 * @returns {boolean} - Returns true if a zap capture is performed.
 */
export function handleYoungWizZapClick(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const wizPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const targetPiece = getPieceAt({ row, col }, currentPieces);

  if (!wizPiece || wizPiece.type !== 'YoungWiz') return false;

  const direction = wizPiece.color === 'White' ? 1 : -1;
  const zapCapturePosition = { row: wizPiece.row + direction, col: wizPiece.col };
  const pieceAtZap = getPieceAt(zapCapturePosition, currentPieces);

  if (targetPiece && pieceAtZap && targetPiece === pieceAtZap && targetPiece.color !== wizPiece.color) {
    const updatedBoard = handleCapture(targetPiece, currentPieces);
    setPieces(updatedBoard);
    setSelectedSquare(null);
    setHighlights([]);
    drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  return false;
}
