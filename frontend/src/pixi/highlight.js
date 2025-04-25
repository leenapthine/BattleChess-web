import * as Pawn from '~/pixi/pieces/basic/Pawn';
import * as Queen from '~/pixi/pieces/basic/Queen';
import * as Rook from '~/pixi/pieces/basic/Rook';
import * as Knight from '~/pixi/pieces/basic/Knight';
import * as Bishop from '~/pixi/pieces/basic/Bishop';
import * as King from '~/pixi/pieces/basic/King';
import * as Necromancer from '~/pixi/pieces/necro/Necromancer';
import * as NecroPawn from '~/pixi/pieces/necro/NecroPawn';
import * as DeadLauncher from '~/pixi/pieces/necro/DeadLauncher';
import * as GhostKnight from '~/pixi/pieces/necro/GhostKnight';
import * as GhoulKing from '~/pixi/pieces/necro/GhoulKing';
import * as QueenOfBones from '~/pixi/pieces/necro/QueenOfBones';
import * as PawnHopper from '~/pixi/pieces/beasts/PawnHopper';
import * as BeastKnight from '~/pixi/pieces/beasts/BeastKnight';
import * as BeastDruid from '~/pixi/pieces/beasts/BeastDruid';
import * as BoulderThrower from '~/pixi/pieces/beasts/BoulderThrower';
import * as FrogKing from '~/pixi/pieces/beasts/FrogKing';

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
  NecroPawn,
  DeadLauncher,
  GhostKnight,
  GhoulKing,
  QueenOfBones,
  PawnHopper,
  BeastKnight,
  BeastDruid,
  BoulderThrower,
  FrogKing,
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
