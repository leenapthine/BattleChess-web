// Description: Logic module for the HellPawn piece, a unique level 2 pawn from the Demons Guild.
//
// Main Functions:
// - highlightMoves(hellPawn, addHighlight, allPieces):
//     Highlights valid movement options for the HellPawn, inheriting standard pawn movement with diagonal capture.
// - handleHellPawnCapture(row, col, pixiApp):
//     Handles the logic for capturing an opponent piece. If the HellPawn captures a non-pawn enemy piece, it transforms
//     into that piece (keeping the color of the HellPawn) and replaces itself on the board.
//
// Special Features or Notes:
// - The HellPawn moves and captures like a standard pawn (one square forward, diagonal capture).
// - When the HellPawn captures a piece, it transforms into that piece, inheriting its movement and abilities, but maintaining
//   the HellPawn's color.
// - If the captured piece is a pawn, the HellPawn does not transform and simply captures the piece as a standard pawn would.
// - The HellPawn can only transform into a non-pawn enemy piece, such as a knight, rook, queen, etc.
// - The transformation is permanent, meaning the HellPawn becomes the captured piece, with the same sprite and abilities,
//   for the rest of the game after capturing a valid piece.
//
// Usage or Context:
// - This module integrates with the PixiJS board renderer and click handler. The logic handles both movement and transformation
//   behavior. The capture logic is implemented in `handleHellPawnCapture.js`, and the movement logic is inherited from
//   `highlightMoves.js`.

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
    switchTurn,
} from '~/state/gameState';
import { handleCapture } from '../../logic/handleCapture';

/**
 * Highlights all valid moves for the HellPawn piece.
 * Inherits standard pawn behavior with diagonal movement.
 *
 * @param {Object} hellPawn - The HellPawn piece being selected.
 * @param {Function} addHighlight - Callback used to push highlight tiles.
 * @param {Array} allPieces - Current state of all pieces on the board.
 */
export function highlightMoves(hellPawn, addHighlight, allPieces) {
  highlightStandardPawnMoves(hellPawn, addHighlight, allPieces);
}

/**
 * Handles the logic when the HellPawn attempts to capture an opponent piece.
 * The HellPawn captures an enemy piece and gains the movement ability from its base class.
 *
 * @param {number} row - The row index of the clicked square.
 * @param {number} col - The column index of the clicked square.
 * @param {Object} pixiApp - The PixiJS application instance, used to render the board.
 * @returns {boolean} Returns true if a capture was performed, false otherwise.
 */
export function handleHellPawnCapture(row, col, pixiApp) {
    const currentPieces = pieces();
    const selectedPosition = selectedSquare();
    const hellPawnPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
    const targetPiece = getPieceAt({ row, col }, currentPieces);

    // Ensure the selected piece is a HellPawn and it's not clicking on itself
    if (!hellPawnPiece || hellPawnPiece.type !== 'HellPawn' || targetPiece === hellPawnPiece) return false;

    // Check if the target piece is an enemy piece and not a pawn
    if (
        targetPiece &&
        targetPiece.color !== hellPawnPiece.color &&
        targetPiece.type !== 'Pawn' &&
        targetPiece.isStone !== true
    ) {
        let updatedPieces = handleCapture(targetPiece, currentPieces, hellPawnPiece);

        // Now, the HellPawn transforms into the captured piece (keeping the color of HellPawn)
        const transformedPiece = { ...targetPiece };
        transformedPiece.color = hellPawnPiece.color;

        // Replace the HellPawn with the transformed piece on the board
        transformedPiece.row = row;
        transformedPiece.col = col;

        // Remove the HellPawn from the board and add the transformed piece
        updatedPieces.push(transformedPiece);
        updatedPieces = updatedPieces.filter(piece => piece.id !== hellPawnPiece.id);

        setPieces(updatedPieces);
        setSelectedSquare(null);
        setHighlights([]);
        drawBoard(pixiApp, handleSquareClick);
        switchTurn();
        
        return true;
    }

    return false;
}
