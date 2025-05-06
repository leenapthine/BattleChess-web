import {
  selectedSquare,
  setSelectedSquare,
  pieces,
  highlights,
  setHighlights,
  isInDominationMode,
  currentTurn,
  switchTurn,
  setPieceViewerPiece,
  setPieceDescription
} from '~/state/gameState';

import { getPieceAt } from './utils';
import descriptions from '~/data/pieceDescriptions';

import { highlightValidMovesForPiece } from '~/pixi/highlight';
import { isSquareSelected } from '~/pixi/utils';
import { handleResurrectionClick } from '~/pixi/logic/handleResurrectionClick';
import { handleSacrificeClick } from '~/pixi/logic/handleSacrificeClick';
import { handlePieceMove } from '~/pixi/logic/handlePieceMove';
import { clearBoardState } from '~/pixi/logic/clearBoardState';
import { drawBoard } from '~/pixi/drawBoard';
import { handleDeadLauncherClick } from "./logic/handleDeadLauncherClick";
import { handleGhoulKingClick } from "./logic/handleGhoulKingClick";
import { handleBoulderThrowerClick } from './pieces/beasts/BoulderThrower';
import { handleQueenOfDominationClick } from '~/pixi/logic/handleQueenOfDominationClick';
import { handleYoungWizZapClick } from '~/pixi/pieces/wizards/YoungWiz';
import { handleQueenOfIllusionsSwap } from '~/pixi/pieces/wizards/QueenOfIllusions';
import { handleWizardTowerCapture } from './pieces/wizards/WizardTower';
import { handleWizardKingCapture } from './pieces/wizards/WizardKing';
import { handleFamiliarClick } from './pieces/wizards/Familiar';
import { handlePortalClick } from './pieces/wizards/Portal';
import { handleHowlerCapture } from './pieces/demons/Howler';
import { handleHellPawnCapture } from './pieces/demons/HellPawn';
import { handleProwlerCapture } from './pieces/demons/Prowler';
import { handleBeholderClick } from './pieces/demons/Beholder';
import { handleHellKingCapture } from './pieces/demons/HellKing';

/**
 * Handles all game board click interactions.
 *
 * This function determines what action to perform based on the square that was clicked:
 *  - NecroPawn sacrifices (priority 1)
 *  - Resurrection placements (priority 2)
 *  - DeadLauncher interaction logic (priority 3)
 *  - Standard movement of a selected piece to a valid target (priority 4)
 *  - Selecting a new piece (priority 5)
 *  - Deselecting the currently selected piece (fallback)
 *
 * @param {number} rowIndex - The row of the clicked square.
 * @param {number} columnIndex - The column of the clicked square.
 * @param {import('pixi.js').Application} pixiApp - The active PixiJS application instance.
 */
export async function handleSquareClick(rowIndex, columnIndex, pixiApp) {
  const currentPieces = pieces();
  const currentSelection = selectedSquare();

  const clickedPiece = currentPieces.find(
    piece => piece.row === rowIndex && piece.col === columnIndex
  );

  const isReclickedSelection =
    currentSelection?.row === rowIndex && currentSelection?.col === columnIndex;

  const isClickedHighlighted = highlights().some(
    highlight =>
      highlight.row === rowIndex &&
      highlight.col === columnIndex
  );

  // Move currently selected piece to highlighted square
  if (isClickedHighlighted && currentSelection) {

    let selectedPiece = getPieceAt(currentSelection, currentPieces);
    if (!selectedPiece) {return;}
    let isTurn = selectedPiece.color === currentTurn();

    // 1. Check for NecroPawn sacrifice
    if (
      await handleSacrificeClick(rowIndex, columnIndex, pixiApp, currentPieces, isTurn)) {
      return;
    }

    // 2. Handle special DeadLauncher behavior
    if (await handleDeadLauncherClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 3. Handle special GhoulKing behavior
    if (await handleGhoulKingClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 4. Handle BoulderThrower click logic
    if (await handleBoulderThrowerClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 5. Handle YoungWiz post-move logic
    if (await handleYoungWizZapClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 6. Handle WizardTower capture logic
    if (await handleWizardTowerCapture(rowIndex, columnIndex, pixiApp)) {
      return;
    }

    // 7. Handle WizardKing logic
    if (await handleWizardKingCapture(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 8. Handle QueenOfDomination click logic
    if (await handleQueenOfDominationClick(rowIndex, columnIndex, pixiApp)) {
      return;
    }

    // 9. Handle QueenOfIllusions click logic
    if (await handleQueenOfIllusionsSwap(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 10. Handle Familiar click logic
    if (await handleFamiliarClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 11. Handle Portal click logic
    if (await handlePortalClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 12. Handle Howler click logic
    if (await handleHowlerCapture(rowIndex, columnIndex, pixiApp)) {
      return;
    }

    // 13. Handle HellPawn click logic
    if (await handleHellPawnCapture(rowIndex, columnIndex, pixiApp)) {
      return;
    }

    // 14. Handle Prowler click logic
    if (await handleProwlerCapture(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 15. Handle Beholder click logic
    if (await handleBeholderClick(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    // 16. Handle HellKing click logic
    if (await handleHellKingCapture(rowIndex, columnIndex, pixiApp, isTurn)) {
      return;
    }

    if (isReclickedSelection) {
      // If the clicked square is the same as the selected square, deselect it
      await clearBoardState();
      return;
    }

    // Check if the selected piece is of the correct player's color (turn check)
    if (!isTurn) {
      console.log("It's not your turn, you cannot move this piece.");
      return false;
    }

    // Now attempt the move (only if it's the correct player's turn)
    const moveSuccessful = await handlePieceMove(
      { row: rowIndex, col: columnIndex },
      pixiApp,
    );

    // Switch turn after the move if successful
    if (moveSuccessful) {
      switchTurn();
      return;
    }
  }

  // Check if in the middle of domination move
  if (isInDominationMode()) {
    const isClickedHighlighted = highlights().some(
      highlight => highlight.row === rowIndex && highlight.col === columnIndex
    );
  
    if (!isClickedHighlighted) {
      console.log("Must move the dominated Queen first!");
      return;
    }
  }

  // Handle resurrection tile placement
  if (
    await handleResurrectionClick(rowIndex, columnIndex, pixiApp)
  ) {
    return;
  }

  // === 5. Select a new piece
  if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
    await clearBoardState({ preserveLaunch: true });
    setSelectedSquare({ row: rowIndex, col: columnIndex });
    if (clickedPiece.stunned) {
      console.log("Piece is stunned and cannot be selected.");
      return;
    } 

    setPieceViewerPiece(clickedPiece);
    setPieceDescription(descriptions[clickedPiece.type] || "No description available.");

    const highlightList = [];
    highlightValidMovesForPiece(
      clickedPiece,
      (highlightRow, highlightCol, highlightColor) => {
        highlightList.push({
          row: highlightRow,
          col: highlightCol,
          color: highlightColor
        });
      },
      currentPieces
    );

    setHighlights(highlightList);
    await drawBoard(pixiApp, handleSquareClick);
    return;
  }

  // === 6. Deselect if clicking empty or already selected square
  await clearBoardState();
  await drawBoard(pixiApp, handleSquareClick);
}
