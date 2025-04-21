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

/**
 * Moves the currently selected piece to a target destination,
 * handles capturing logic, resets interaction state, and redraws the board.
 *
 * @param {{ row: number, col: number }} destination - The board square to move to.
 * @param {Application} pixiApp - The PixiJS application instance managing the canvas.
 * @returns {Promise<boolean>} True if the move was executed successfully.
 */
export async function handlePieceMove(destination, pixiApp) {
  const currentPieces = pieces();
  const from = selectedSquare();

  if (!from) return false;

  const movingPiece = currentPieces.find(
    piece => piece.row === from.row && piece.col === from.col
  );

  if (!movingPiece) return false;

  const capturedPiece = getPieceAt(destination, currentPieces);

  // Update the board: remove captured piece, move selected piece
  const updatedPieces = currentPieces
    .filter(piece => !(piece.row === destination.row && piece.col === destination.col))
    .map(piece => {
      if (piece.row === from.row && piece.col === from.col) {
        return { ...piece, row: destination.row, col: destination.col };
      }
      return piece;
    });

  // Apply updated state
  setPieces(updatedPieces);
  setSelectedSquare(null);
  setHighlights([]);
  setSacrificeMode(null);

  // Apply GhostKnight stun logic if needed
  const movedVersion = { ...movingPiece, row: destination.row, col: destination.col };
  applyStunEffect(movedVersion, updatedPieces);
  
  // Handle resurrection prompts (e.g. Necromancer ability)
  triggerResurrectionPrompt(movingPiece, capturedPiece, destination, updatedPieces);

  // Redraw the board
  await drawBoard(pixiApp, handleSquareClick);
  return true;
}
