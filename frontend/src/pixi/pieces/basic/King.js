import { getPieceAt, isOpponentPiece } from '~/pixi/utils';
import { currentTurn } from '~/state/gameState';

/**
 * Highlight valid King moves (1 square in any direction).
 * @param {Object} piece - The selected King piece
 * @param {Function} addHighlight - Callback to register a highlight
 * @param {Array} allPieces - All pieces on the board
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const { row, col, color } = piece;

  // Get current turn directly from the signal
  const isOpponentTurn = color !== currentTurn();

  // All 8 adjacent directions
  const directions = [
    { rowOffset:  1, colOffset:  0 },
    { rowOffset: -1, colOffset:  0 },
    { rowOffset:  0, colOffset:  1 },
    { rowOffset:  0, colOffset: -1 },
    { rowOffset:  1, colOffset:  1 },
    { rowOffset:  1, colOffset: -1 },
    { rowOffset: -1, colOffset:  1 },
    { rowOffset: -1, colOffset: -1 },
  ];

  for (const { rowOffset, colOffset } of directions) {
    const targetRow = row + rowOffset;
    const targetCol = col + colOffset;

    if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
      const target = { row: targetRow, col: targetCol };
      const pieceAtTarget = getPieceAt(target, allPieces);

      if (!pieceAtTarget) {
        addHighlight(targetRow, targetCol, isOpponentTurn ? 0xe5e4e2 : 0xffff00); // Move
      } else if (isOpponentPiece(target, color, allPieces)) {
        addHighlight(targetRow, targetCol, isOpponentTurn ? 0xe5e4e2 : 0xff0000); // Capture
      }
    }
  }
}
