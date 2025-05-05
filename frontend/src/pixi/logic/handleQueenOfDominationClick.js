import {
  pieces,
  setPieces,
  setSelectedSquare,
  selectedSquare,
  setHighlights,
  currentTurn,
} from '~/state/gameState';

import { getPieceAt } from '~/pixi/utils';
import { drawBoard } from '~/pixi/drawBoard';
import { highlightValidMovesForPiece } from '~/pixi/highlight';
import { applyDominationAbility, returnOriginalSprite } from '~/pixi/pieces/beasts/QueenOfDomination';
import { handleSquareClick } from '~/pixi/clickHandler';

/**
 * Handles all click interactions related to QueenOfDomination:
 * - First click selects the Queen and highlights adjacent friendly units.
 * - Second click on an adjacent friendly unit transforms it into a Queen temporarily.
 * - If the transformed Queen has no valid moves, reverts instantly.
 * - Clicking on herself cancels the domination ability.
 *
 * @param {number} row - Row index of the clicked square.
 * @param {number} col - Column index of the clicked square.
 * @param {PIXI.Application} pixiApp - The PixiJS application instance.
 * @returns {Promise<boolean>} True if handled, otherwise false.
 */
export async function handleQueenOfDominationClick(row, col, pixiApp) {
  const currentPieces = pieces();
  const selectedPosition = selectedSquare();
  const queenPiece = selectedPosition ? getPieceAt(selectedPosition, currentPieces) : null;
  const clickedPiece = getPieceAt({ row, col }, currentPieces);

  // === Step 1: Ignore if no QueenOfDomination is selected
  if (!queenPiece || queenPiece.type !== 'QueenOfDomination') {
    return false;
  }

  // === Step 2: Ignore if Queen has already used her domination ability
  if (queenPiece.pieceLoaded) {
    return false;
  }

  // === Step 3: Process adjacent friendly click
  if (clickedPiece && clickedPiece.color === queenPiece.color && clickedPiece.color === currentTurn()) {
    
    // --- Cancel if clicking herself again
    if (clickedPiece.id === queenPiece.id) {
      setSelectedSquare(null);
      setHighlights([]);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }

    // --- Apply domination ability
    const updatedPieces = applyDominationAbility(queenPiece, clickedPiece, currentPieces);
    setPieces(updatedPieces);

    // --- Locate the newly dominated Queen
    const dominatedPiece = updatedPieces.find(piece => piece.id === clickedPiece.id);

    // === Step 4: If dominated piece has no valid moves, revert immediately
    if (dominatedPiece && !hasValidMoves(dominatedPiece, updatedPieces)) {
      console.log("Dominated piece has no moves. Reverting domination.");

      const updatedQueenPiece = updatedPieces.find(piece => piece.id === queenPiece.id);
      const revertedPieces = returnOriginalSprite(updatedQueenPiece, dominatedPiece, updatedPieces);
      
      setPieces(revertedPieces);
      setSelectedSquare(null);
      setHighlights([]);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }

    // === Step 5: Force user to move the newly dominated Queen
    if (dominatedPiece) {
      setSelectedSquare({ row: dominatedPiece.row, col: dominatedPiece.col });

      const newHighlights = [];
      highlightValidMovesForPiece(
        dominatedPiece,
        (targetRow, targetCol, highlightColor) => {
          newHighlights.push({
            row: targetRow,
            col: targetCol,
            color: highlightColor
          });
        },
        updatedPieces
      );
      setHighlights(newHighlights);
    }

    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  return false;
}

/**
 * Utility to determine if a piece has at least one valid move available.
 *
 * @param {Object} piece - The piece to check.
 * @param {Array} allPieces - Current list of all board pieces.
 * @returns {boolean} True if at least one valid move exists.
 */
function hasValidMoves(piece, allPieces) {
  const validMoves = [];
  highlightValidMovesForPiece(
    piece,
    (moveRow, moveCol) => validMoves.push({ row: moveRow, col: moveCol }),
    allPieces
  );
  return validMoves.length > 0;
}
