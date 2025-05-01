// Description: Logic module for the Howler piece, a custom level 2 Demons guild piece 
// with dynamic movement abilities based on captured pieces.
//
// Main Functions:
// - highlightMoves(howler, addHighlight, allPieces):
//     Highlights all valid movement tiles for the Howler, including its base Bishop movement and additional movement
//     abilities gained from captured pieces (Knight, Rook, Queen, and Pawn).
// - handleHowlerCapture(row, col, pixiApp):
//     Handles the capture of an opponent piece by the Howler. Upon capturing a piece, the Howler gains the movement
//     abilities of the captured piece and moves into its square.
//
// Special Features or Notes:
// - The Howler starts with diagonal movement, inheriting standard Bishop behavior.
// - When the Howler captures a piece, it gains that piece's movement ability:
//   - If it captures a **Knight**, it gains Knight's L-shaped movement.
//   - If it captures a **Rook**, it gains Rook's straight-line movement.
//   - If it captures a **Queen**, it gains Queen's combined straight and diagonal movement.
//   - If it captures a **Pawn**, it gains Pawn's single-square forward movement and capture mechanics.
// - After capturing a piece, the Howler immediately moves into the captured piece’s square, adopting its movement abilities.
// - The Howler cannot capture itself and is limited to gaining movement abilities only from enemy pieces.
//
// Usage or Context:
// - This file integrates with the PixiJS board renderer and click handler.
// - Movement logic is extended from the Bishop’s base movement logic, while capture and ability-gaining logic is handled in `handleHowlerCapture.js`.

import { highlightMoves as highlightStandardBishopMoves } from '~/pixi/pieces/basic/Bishop'; 
import { highlightMoves as highlightStandardKnightMoves } from '~/pixi/pieces/basic/Knight';
import { highlightMoves as highlightStandardRookMoves } from '~/pixi/pieces/basic/Rook';
import { highlightMoves as highlightStandardQueenMoves } from '~/pixi/pieces/basic/Queen';
import { highlightMoves as highlightStandardPawnMoves } from '~/pixi/pieces/basic/Pawn';
import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '../../drawBoard';
import { handleSquareClick } from '../../clickHandler';
import {
    pieces,
    selectedSquare,
    setSelectedSquare,
    setPieces,
    setHighlights,
    highlights,
} from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Highlights all valid moves for the Howler piece.
 * Inherits standard bishop behavior with diagonal movement.
 *
 * @param {Object} howler - The Howler piece being selected.
 * @param {Function} addHighlight - Callback used to push highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(howler, addHighlight, allPieces) {
  highlightStandardBishopMoves(howler, addHighlight, allPieces);

  if (howler.gainedAbilities.knight) {
    highlightStandardKnightMoves(howler, addHighlight, allPieces);
  }
  if (howler.gainedAbilities.rook) {
    highlightStandardRookMoves(howler, addHighlight, allPieces);
  }
  if (howler.gainedAbilities.queen) {
    highlightStandardQueenMoves(howler, addHighlight, allPieces);
  }
  if (howler.gainedAbilities.pawn) {
    highlightStandardPawnMoves(howler, addHighlight, allPieces);
  }
}

/**
 * Handles the logic when the Howler attempts to capture an opponent piece.
 * The Howler captures an enemy piece and gains the movement ability from its base class.
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export function handleHowlerCapture(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const howlerPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const targetPiece = getPieceAt({ row, col }, currentPieces);

  // Ensure the selected piece is a Howler
  if (!howlerPiece || howlerPiece.type !== 'Howler' || targetPiece === howlerPiece) return false;

  // Check if the target piece is highlighted as a valid capture (i.e., it's red for capture)
  const highlight = highlights().find(h => h.row === row && h.col === col);
  if (!highlight || highlight.color !== 0xff0000) {
    return false;
  }

  // Check if the target piece is an enemy piece
  if (targetPiece) {
    let updatedPieces = handleCapture(targetPiece, currentPieces);
    howlerPiece.row = row;
    howlerPiece.col = col;

    // Set the movement ability based on the captured piece type (only for this specific Howler)
    if (['Knight', 'BeastKnight', 'GhostKnight', 'Prowler', 'Familiar'].includes(targetPiece.type)) {
      howlerPiece.gainedAbilities.knight = true;
    } else if (['Rook', 'Beholder', 'BoulderThrower', 'Deadlauncher', 'Portal'].includes(targetPiece.type)) {
      howlerPiece.gainedAbilities.rook = true;
    } else if (['Queen', 'QueenOfIllusions', 'QueenOfDomination', 'QueenOfBones', 'QueenOfDestruction'].includes(targetPiece.type)) {
      howlerPiece.gainedAbilities.queen = true;
    } else if (['Pawn', 'NecroPawn', 'YoungWiz', 'PawnHopper', 'HellPawn'].includes(targetPiece.type)) {
      howlerPiece.gainedAbilities.pawn = true;
    }

    setPieces(updatedPieces);
    setSelectedSquare(null);
    setHighlights([]);
    drawBoard(pixiApp, handleSquareClick);

    return true;
  }
  return false;
}


