import {
  pieces,
  setPieces,
  selectedSquare,
  setSelectedSquare,
  setHighlights,
  setSacrificeMode,
  currentTurn,
} from '~/state/gameState';

import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';
import { triggerResurrectionPrompt } from '~/pixi/logic/handleResurrectionClick';
import { applyStunEffect } from '~/pixi/pieces/necro/GhostKnight';
import { handlePawnHopperPostMove } from '~/pixi/pieces/beasts/PawnHopper';
import { returnOriginalSprite } from '~/pixi/pieces/beasts/QueenOfDomination';
import { handleCapture } from '~/pixi/logic/handleCapture';

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

  // Step 1: Check if there is a piece at the destination
  const targetPiece = getPieceAt(destination, allPieces); // Get the piece at the destination

  let updatedPieces = allPieces; // Start with the original pieces list

  // Step 2: Handle capture if an enemy piece is at the destination
  if (targetPiece) {
    // If there is a piece at the destination, attempt to handle the capture
    updatedPieces = handleCapture(targetPiece, allPieces, selectedPiece);
    
    // If handleCapture fails (i.e., if no piece is captured), we should return early
    if (updatedPieces === allPieces) {
      return;
    }
  }

  // Step 3: If the capture was successful, move the selected piece to the destination
  updatedPieces = updatedPieces.map(piece =>
    piece.row === fromSquare.row && piece.col === fromSquare.col
      ? { ...piece, row: destination.row, col: destination.col }
      : piece
  );

  // Step 4: Handle post-move logic
  const { updatedPieces: finalPieceList, captured: hopCapturedPiece } = handlePawnHopperPostMove(
    fromSquare,
    destination,
    updatedPieces,
    selectedPiece,
    selectedPiece.color
  );

  if (hopCapturedPiece) {
    updatedPieces = handleCapture(hopCapturedPiece, finalPieceList);
  }

  // Step 5: Check if any QueenOfDomination is tracking this moved piece
  const movedPiece = { ...selectedPiece, row: destination.row, col: destination.col };
  const dominatingQueen = allPieces.find(p =>
    p.type === 'QueenOfDomination' && p.pieceLoaded && p.pieceLoaded.id === movedPiece.id
  );

  if (dominatingQueen) {
    updatedPieces = returnOriginalSprite(dominatingQueen, movedPiece, finalPieceList);
  }

  // Step 6: Commit state updates
  setPieces(updatedPieces);
  setSelectedSquare(null);
  setHighlights([]);
  setSacrificeMode(null);

  // Step 7: Apply any passive effects triggered by the move
  const movedPieceFinal = { ...selectedPiece, row: destination.row, col: destination.col };
  applyStunEffect(movedPieceFinal, updatedPieces);
  triggerResurrectionPrompt(selectedPiece, targetPiece, destination, updatedPieces);

  console.log('Piece moved:', movedPieceFinal);

  // Step 8: Check if the piece is stunned and remove stun effect
  if (currentTurn() === 'White') {
    for (const piece in pieces()) {
      if (piece.color === 'White') {
        piece.stunned = false;
      }
    }
  } else {
    for (const piece of pieces()) {
      if (piece.color === 'Black') {
        piece.stunned = false;
      }
    }
  }

  // Step 9: Redraw the board
  await drawBoard(pixiApp, handleSquareClick);
  return true;
}

