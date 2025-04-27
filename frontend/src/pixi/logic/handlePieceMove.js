import {
  pieces,
  setPieces,
  selectedSquare,
  setSelectedSquare,
  setHighlights,
  setSacrificeMode,
} from '~/state/gameState';

import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';
import { triggerResurrectionPrompt } from '~/pixi/logic/handleResurrectionClick';
import { applyStunEffect } from '~/pixi/pieces/necro/GhostKnight';
import { handlePawnHopperPostMove } from '~/pixi/pieces/beasts/PawnHopper';
import { returnOriginalSprite } from '~/pixi/pieces/beasts/QueenOfDomination'; // ✅ new import

/**
 * Handles the movement of the currently selected piece to a destination square.
 * Applies standard and ability-specific effects (e.g., capture, stun, resurrection).
 *
 * @param {{ row: number, col: number }} destination - Target square for the move.
 * @param {Application} pixiApp - The PixiJS application instance rendering the board.
 * @returns {Promise<boolean>} True if the move completed successfully.
 */
export async function handlePieceMove(destination, pixiApp) {
  const allPieces = pieces();
  const fromSquare = selectedSquare();

  if (!fromSquare) return false;

  const selectedPiece = allPieces.find(
    piece => piece.row === fromSquare.row && piece.col === fromSquare.col
  );

  if (!selectedPiece) return false;

  let capturedPiece = getPieceAt(destination, allPieces);

  // Step 1: Move the selected piece and remove any directly captured piece
  let movedPieceList = allPieces
    .filter(piece => !(piece.row === destination.row && piece.col === destination.col))
    .map(piece =>
      piece.row === fromSquare.row && piece.col === fromSquare.col
        ? { ...piece, row: destination.row, col: destination.col }
        : piece
    );

  // Step 2: Handle PawnHopper-specific hop capture logic
  const { updatedPieces: finalPieceList, captured: hopCapturedPiece } = handlePawnHopperPostMove(
    fromSquare,
    destination,
    movedPieceList,
    selectedPiece,
    selectedPiece.color
  );

  if (hopCapturedPiece) {
    capturedPiece = hopCapturedPiece;
  }

  let trulyFinalPieces = finalPieceList;

  // Step 2.5: Check if any QueenOfDomination is tracking this moved piece
  const movedPiece = { ...selectedPiece, row: destination.row, col: destination.col };
  const dominatingQueen = allPieces.find(p =>
    p.type === 'QueenOfDomination' && p.pieceLoaded && p.pieceLoaded.id === movedPiece.id
  );

  if (dominatingQueen) {
    trulyFinalPieces = returnOriginalSprite(dominatingQueen, movedPiece, finalPieceList);
  }

  // Step 3: Commit state updates
  setPieces(trulyFinalPieces);
  setSelectedSquare(null);
  setHighlights([]);
  setSacrificeMode(null);

  // Step 4: Apply any passive effects triggered by the move
  const movedPieceFinal = { ...selectedPiece, row: destination.row, col: destination.col };
  applyStunEffect(movedPieceFinal, trulyFinalPieces);
  triggerResurrectionPrompt(selectedPiece, capturedPiece, destination, trulyFinalPieces);

  // Step 5: Redraw the board
  await drawBoard(pixiApp, handleSquareClick);
  return true;
}
