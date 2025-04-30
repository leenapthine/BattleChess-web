import {
  selectedSquare,
  setSelectedSquare,
  pieces,
  highlights,
  setHighlights,
  isInDominationMode,
} from '~/state/gameState';

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
import { handleYoungWizZapClick } from '~/pixi/pieces/wizards/youngWiz';
import { handleQueenOfIllusionsSwap } from '~/pixi/pieces/wizards/QueenOfIllusions';
import { handleWizardTowerCapture } from './pieces/wizards/WizardTower';
import { handleWizardKingCapture } from './pieces/wizards/WizardKing';
import { handleFamiliarClick } from './pieces/wizards/Familiar';
import { handlePortalClick } from './pieces/wizards/Portal';
import { handleHowlerCapture } from './pieces/demons/Howler';
import { handleHellPawnCapture } from './pieces/demons/Hellpawn';

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
      highlight.col === columnIndex &&
      !isReclickedSelection
  );

  // === 0. Check if in the middle of domination move
  if (isInDominationMode()) {
    const isClickedHighlighted = highlights().some(
      highlight => highlight.row === rowIndex && highlight.col === columnIndex
    );
  
    if (!isClickedHighlighted) {
      console.log("Must move the dominated Queen first!");
      return;
    }
  }

  // === 1. Check for NecroPawn sacrifice
  if (await handleSacrificeClick(rowIndex, columnIndex, pixiApp, currentPieces)) {
    return;
  }

  // === 2. Handle resurrection tile placement
  if (await handleResurrectionClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // === 3. Handle special DeadLauncher behavior
  if (await handleDeadLauncherClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 3. Handle special GhoulKing behavior
  if (await handleGhoulKingClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 4. Handle BoulderThrower click logic
  if (await handleBoulderThrowerClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 5. Handle YoungWiz post-move logic
  if (await handleYoungWizZapClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 6. Handle WizardTower capture logic
  if (await handleWizardTowerCapture(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 7. Handle WizardKing logic
  if (await handleWizardKingCapture(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 8. Handle QueenOfDomination click logic
  if (await handleQueenOfDominationClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 9. Handle QueenOfIllusions click logic
  if (await handleQueenOfIllusionsSwap(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 10. Handle Familiar click logic
  if (await handleFamiliarClick(rowIndex, columnIndex, pixiApp)) {
    return;
  }

  // 11. Handle Portal click logic
  if (await handlePortalClick(rowIndex, columnIndex, pixiApp)) {
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

  // === 4. Move currently selected piece to highlighted square
  if (isClickedHighlighted && currentSelection) {
    const moveSuccessful = await handlePieceMove(
      { row: rowIndex, col: columnIndex },
      pixiApp
    );
    if (moveSuccessful) return;
  }

  // === 5. Select a new piece
  if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
    await clearBoardState({ preserveLaunch: true });
    setSelectedSquare({ row: rowIndex, col: columnIndex });
    if (clickedPiece.stunned) {
      console.log("Piece is stunned and cannot be selected.");
      return;
    } 

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
