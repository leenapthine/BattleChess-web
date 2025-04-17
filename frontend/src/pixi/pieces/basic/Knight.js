import { getPieceAt, isOpponentPiece } from '~/pixi/utils';

/**
 * Adds highlight markers for all valid Knight moves.
 * The Knight moves in an L-shape (2 squares in one direction, then 1 perpendicular).
 * Ignores all blocking pieces along the path.
 *
 * @param {Object} piece - The Knight piece
 * @param {Function} addHighlight - Callback to register highlight at (row, col, color)
 * @param {Array} allPieces - List of all pieces currently on the board
 */
export function highlightMoves(piece, addHighlight, allPieces) {
  const { row, col, color } = piece;

  const knightMoves = [
    { rowOffset: -2, colOffset: -1 },
    { rowOffset: -2, colOffset: 1 },
    { rowOffset: -1, colOffset: -2 },
    { rowOffset: -1, colOffset: 2 },
    { rowOffset: 1, colOffset: -2 },
    { rowOffset: 1, colOffset: 2 },
    { rowOffset: 2, colOffset: -1 },
    { rowOffset: 2, colOffset: 1 },
  ];

  for (const { rowOffset, colOffset } of knightMoves) {
    const targetRow = row + rowOffset;
    const targetCol = col + colOffset;

    if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) continue;

    const targetPos = { row: targetRow, col: targetCol };
    const targetPiece = getPieceAt(targetPos, allPieces);

    if (!targetPiece) {
      addHighlight(targetRow, targetCol, 0xffff00); // yellow for movement
    } else if (isOpponentPiece(targetPos, color, allPieces)) {
      addHighlight(targetRow, targetCol, 0xff0000); // red for capture
    }
  }
}
