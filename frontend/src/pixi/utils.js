import { selectedSquare } from '~/state/gameState';

/**
 * Returns the piece located at the given board position.
 * 
 * @param {{ row: number, col: number }} position - The board coordinates to check.
 * @param {Array} allPieces - The list of all active pieces on the board.
 * @returns {Object|null} The piece at the given position, or null if none is found.
 */
export function getPieceAt(position, allPieces) {
  return allPieces.find(piece => piece.row === position.row && piece.col === position.col) || null;
}

/**
 * Determines whether a piece at the given position belongs to the opposing color.
 * 
 * @param {{ row: number, col: number }} position - The board coordinates to evaluate.
 * @param {string} currentColor - The color of the current player ('White' or 'Black').
 * @param {Array} allPieces - The list of all active pieces on the board.
 * @returns {boolean} True if the piece at the position exists and is an opponent; false otherwise.
 */
export function isOpponentPiece(position, currentColor, allPieces) {
  const occupyingPiece = getPieceAt(position, allPieces);
  return occupyingPiece && occupyingPiece.color !== currentColor;
}

/**
 * Checks whether the specified board square is currently selected.
 * 
 * @param {number} rowIndex - The row index of the square.
 * @param {number} columnIndex - The column index of the square.
 * @returns {boolean} True if the square matches the currently selected square; false otherwise.
 */
export function isSquareSelected(rowIndex, columnIndex) {
  const currentSelection = selectedSquare();
  return currentSelection &&
    currentSelection.row === rowIndex &&
    currentSelection.col === columnIndex;
}

/**
 * Returns all orthogonally adjacent tiles to a given piece.
 *
 * @param {Object} piece - The piece to get adjacent tiles for.
 * @returns {Array} List of adjacent positions.
 */
export function getAdjacentTiles(piece) {
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];

  return directions
    .map(({ dx, dy }) => ({ row: piece.row + dy, col: piece.col + dx }))
    .filter(pos => pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8);
}

