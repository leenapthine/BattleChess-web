import { getPieceAt, isOpponentPiece } from '~/pixi/utils';

/**
 * Adds highlight markers for all valid Rook moves.
 * The Rook moves in straight lines (up, down, left, right) until blocked.
 *
 * @param {Object} piece - The Rook piece
 * @param {Function} addHighlight - Callback to register highlight at (row, col, color)
 * @param {Array} allPieces - List of all pieces currently on the board
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const { row, col, color } = piece;

  const directions = [
    { rowOffset: -1, colOffset: 0 },  // up
    { rowOffset: 1, colOffset: 0 },   // down
    { rowOffset: 0, colOffset: -1 },  // left
    { rowOffset: 0, colOffset: 1 },   // right
  ];

  for (const { rowOffset, colOffset } of directions) {
    for (let step = 1; step < 8; step++) {
      const targetRow = row + step * rowOffset;
      const targetCol = col + step * colOffset;

      if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) break;

      const targetPos = { row: targetRow, col: targetCol };
      const targetPiece = getPieceAt(targetPos, allPieces);

      if (targetPiece) {
        if (isOpponentPiece(targetPos, color, allPieces)) {
          addHighlight(targetRow, targetCol, 0xff0000); // red for capture
        }
        break;
      }

      addHighlight(targetRow, targetCol, 0xffff00); // yellow for valid move
    }
  }
}
