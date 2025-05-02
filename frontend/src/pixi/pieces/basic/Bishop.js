import { getPieceAt, isOpponentPiece } from '~/pixi/utils';
import { currentTurn } from '~/state/gameState';

/**
 * Adds highlight markers for all valid Bishop moves.
 * The Bishop moves diagonally in any direction, stopping when blocked.
 *
 * @param {Object} piece - The Bishop piece
 * @param {Function} addHighlight - Callback to register highlight at (row, col, color)
 * @param {Array} allPieces - List of all pieces currently on the board
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const { row, col, color } = piece;

  // Get current turn directly from the signal
  const isOpponentTurn = color !== currentTurn();

  const directions = [
    { rowStep: -1, colStep: -1 },
    { rowStep: -1, colStep: 1 },
    { rowStep: 1, colStep: -1 },
    { rowStep: 1, colStep: 1 },
  ];

  for (const { rowStep, colStep } of directions) {
    let step = 1;
    while (true) {
      const targetRow = row + step * rowStep;
      const targetCol = col + step * colStep;

      if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) break;

      const targetPos = { row: targetRow, col: targetCol };
      const targetPiece = getPieceAt(targetPos, allPieces);

      if (!targetPiece) {
        addHighlight(targetRow, targetCol, isOpponentTurn ? 0xe5e4e2 : 0xffff00); // yellow for movement
      } else {
        if (isOpponentPiece(targetPos, color, allPieces)) {
          addHighlight(targetRow, targetCol, isOpponentTurn ? 0xe5e4e2 : 0xff0000); // red for capture
        }
        break; // stop in any case when hitting a piece
      }

      step++;
    }
  }
}
