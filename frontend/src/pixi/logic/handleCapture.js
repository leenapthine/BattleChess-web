import { triggerResurrectionPrompt } from '~/pixi/logic/handleResurrectionClick';

/**
 * Handles removal of a captured piece and triggers post-capture logic (e.g. QueenOfBones revive).
 *
 * @param {Object} capturedPiece - The piece that was captured.
 * @param {Array} currentPieces - The full list of pieces BEFORE capture.
 * @param {Object} capturingPiece - The piece doing the capturing (optional, for context).
 * @returns {Array} The updated list of pieces AFTER capture.
 */
export function handleCapture(capturedPiece, currentPieces, capturingPiece = null) {
  if (!capturedPiece) return currentPieces;

  // Check if the captured piece is turned to stone
  if (capturedPiece.isStone) {
    console.log(`${capturedPiece.type} is turned to stone and cannot be captured.`);
    return currentPieces; // Do not capture the piece
  }

  const updatedPieces = currentPieces.filter(p => p.id !== capturedPiece.id);

  // Trigger resurrection effect if applicable
  triggerResurrectionPrompt(capturingPiece, capturedPiece, { row: capturedPiece.row, col: capturedPiece.col }, updatedPieces);

  return updatedPieces;
}

