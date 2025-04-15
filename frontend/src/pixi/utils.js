/**
 * Returns the piece at the given board position (row, col) or null.
 * @param {{ row: number, col: number }} pos 
 * @param {Array} allPieces 
 * @returns {Object|null}
 */
export function getPieceAt(pos, allPieces) {
    return allPieces.find(p => p.row === pos.row && p.col === pos.col) || null;
  }
  
  /**
   * Returns true if a piece at the given position exists and is an opponent.
   * @param {{ row: number, col: number }} pos 
   * @param {string} color - 'White' or 'Black'
   * @param {Array} allPieces 
   * @returns {boolean}
   */
  export function isOpponentPiece(pos, color, allPieces) {
    const piece = getPieceAt(pos, allPieces);
    return piece && piece.color !== color;
  }
  