import { getPieceAt, isOpponentPiece } from '~/pixi/utils';
import { currentTurn } from '~/state/gameState';

/**
 * Highlight all valid moves for a Pawn.
 * @param {Object} piece - The Pawn piece.
 * @param {Function} addHighlight - Callback to add a highlighted square.
 * @param {Array} allPieces - Current game state of pieces.
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const { row, col, color } = piece;
  const direction = color === 'White' ? 1 : -1;
  const startRow = color === 'White' ? 1 : 6;

  // Get current turn directly from the signal
  const isOpponentTurn = color !== currentTurn(); // Check if it's the opponent's turn

  // Determine the highlight color based on the turn
  const highlightColor = isOpponentTurn ? 0xe5e4e2 : 0xffff00;

  // One step forward
  const forward1 = { row: row + direction, col };
  if (!getPieceAt(forward1, allPieces)) {
    addHighlight(forward1.row, forward1.col, highlightColor);

    // Two steps forward if at starting row
    const forward2 = { row: row + 2 * direction, col };
    if (row === startRow && !getPieceAt(forward2, allPieces)) {
      addHighlight(forward2.row, forward2.col, highlightColor);
    }
  }

  // Diagonal captures
  for (const dc of [-1, 1]) {
    const diag = { row: row + direction, col: col + dc };
    if (isOpponentPiece(diag, color, allPieces)) {
      addHighlight(diag.row, diag.col, highlightColor);
    }
  }
}
