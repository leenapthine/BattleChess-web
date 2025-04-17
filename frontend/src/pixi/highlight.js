import * as Pawn from '~/pixi/pieces/basic/Pawn';
import * as Queen from '~/pixi/pieces/basic/Queen';
import * as Rook from '~/pixi/pieces/basic/Rook';
import * as Knight from '~/pixi/pieces/basic/Knight';
import * as Bishop from '~/pixi/pieces/basic/Bishop';
import * as King from '~/pixi/pieces/basic/King';
import * as Necromancer from '~/pixi/pieces/necro/Necromancer';

/**
 * Mapping of piece types to their associated highlight logic modules.
 * Extend this map as you add more piece types.
 */
const pieceLogicMap = {
  Pawn,
  Queen,
  Rook,
  Knight,
  Bishop,
  King,
  Necromancer,
};

/**
 * Dispatches to the correct piece-specific highlight logic module
 * to determine legal moves for the given piece.
 * 
 * @param {Object} piece - The currently selected piece.
 * @param {Function} addHighlight - A callback function to record each valid move:
 *   `(row: number, col: number, color: number) => void`
 * @param {Array<Object>} allPieces - The full list of all current pieces on the board.
 */
export function highlightValidMovesForPiece(piece, addHighlight, allPieces) {
  const pieceLogicModule = pieceLogicMap[piece.type];
  if (pieceLogicModule?.highlightMoves) {
    pieceLogicModule.highlightMoves(piece, addHighlight, allPieces);
  }
}
