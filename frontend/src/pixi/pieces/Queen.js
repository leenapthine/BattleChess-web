import { getPieceAt, isOpponentPiece } from '~/pixi/utils';

/**
 * Adds highlight markers for all valid Queen moves.
 * The Queen can move any number of spaces in a straight line (horizontal, vertical, or diagonal),
 * stopping at obstacles or opponent pieces.
 *
 * @param {Object} piece - The Queen piece
 * @param {Function} addHighlight - Callback to register highlight at (row, col, color)
 * @param {Array} allPieces - List of all pieces currently on the board
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const { row, col, color } = piece;

  const directions = [
    { rowOffset: -1, colOffset: 0 },   // up
    { rowOffset: 1, colOffset: 0 },    // down
    { rowOffset: 0, colOffset: -1 },   // left
    { rowOffset: 0, colOffset: 1 },    // right
    { rowOffset: -1, colOffset: -1 },  // up-left
    { rowOffset: -1, colOffset: 1 },   // up-right
    { rowOffset: 1, colOffset: -1 },   // down-left
    { rowOffset: 1, colOffset: 1 },    // down-right
  ];

  for (const { rowOffset, colOffset } of directions) {
    for (let i = 1; i < 8; i++) {
      const targetRow = row + i * rowOffset;
      const targetCol = col + i * colOffset;

      if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) break;

      const targetPos = { row: targetRow, col: targetCol };
      const targetPiece = getPieceAt(targetPos, allPieces);

      if (targetPiece) {
        if (isOpponentPiece(targetPos, color, allPieces)) {
          addHighlight(targetRow, targetCol, 0xff0000); // red for capture
        }
        break; // stop path after hitting any piece
      }

      addHighlight(targetRow, targetCol, 0xffff00); // yellow for valid move
    }
  }
}
