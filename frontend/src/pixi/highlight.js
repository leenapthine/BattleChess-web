import * as Pawn from '~/pixi/pieces/Pawn';

const pieceLogicMap = {
  Pawn,
};

export function highlightValidMovesForPiece(piece, addHighlight, allPieces) {
  const logic = pieceLogicMap[piece.type];
  if (logic?.highlightMoves) {
    logic.highlightMoves(piece, addHighlight, allPieces);
  }
}
