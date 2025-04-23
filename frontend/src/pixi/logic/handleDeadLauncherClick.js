import {
  pieces,
  setPieces,
  selectedSquare,
  setSelectedSquare,
  setHighlights,
  launchMode,
  setLaunchMode,
  isInLoadingMode,
  setIsInLoadingMode,
} from '~/state/gameState';

import { getPieceAt } from '../utils';
import { getLaunchTargets, highlightMoves } from '../pieces/necro/DeadLauncher';
import { drawBoard } from '../drawBoard';
import { handleSquareClick } from '../clickHandler';
import { clearBoardState } from './clearBoardState';

/**
 * Handles DeadLauncher-specific interactions:
 * - Step 1: Select DeadLauncher normally (handled outside)
 * - Step 2: Click DeadLauncher again to enter loading mode
 * - Step 3: Click adjacent Pawn/NecroPawn to load
 * - Step 4: Click DeadLauncher again to enter launch mode
 * - Step 5: Click red-highlighted target to launch
 */
export async function handleDeadLauncherClick(rowIndex, columnIndex, pixiApp) {
  const allPieces = pieces();
  const clickedPiece = getPieceAt({ row: rowIndex, col: columnIndex }, allPieces);
  const selectedPosition = selectedSquare();
  const activeLauncher = launchMode();

  // Step 5: Launch at valid target
  if (activeLauncher) {
    const isTargetValid = getLaunchTargets(activeLauncher, allPieces).some(
      target => target.row === rowIndex && target.col === columnIndex
    );

    if (isTargetValid) {
      const updatedLauncher = { ...activeLauncher, pawnLoaded: false };
      const remainingPieces = allPieces.filter(
        piece => !(piece.id === activeLauncher.id || (piece.row === rowIndex && piece.col === columnIndex))
      );
      setPieces([...remainingPieces, updatedLauncher]);
      setLaunchMode(null);
      setSelectedSquare(null);
      setHighlights([]);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }
  }

  // Step 2 or 4: Click self again
  if (
    selectedPosition?.row === rowIndex &&
    selectedPosition?.col === columnIndex &&
    clickedPiece?.type === "DeadLauncher"
  ) {
    if (!clickedPiece.pawnLoaded && !isInLoadingMode()) {
      // Step 2: Enter loading mode
      const updatedLauncher = { ...clickedPiece };
      setIsInLoadingMode(true);
      const updatedPieces = allPieces.map(piece =>
        piece.id === updatedLauncher.id ? updatedLauncher : piece
      );
      setPieces(updatedPieces);
      setSelectedSquare({ row: rowIndex, col: columnIndex });

      const highlightList = [];
      highlightMoves(
        updatedLauncher,
        (highlightRow, highlightCol, color) => highlightList.push({ row: highlightRow, col: highlightCol, color }),
        updatedPieces
      );
      setHighlights(highlightList);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }

    if (clickedPiece.pawnLoaded && !launchMode()) {
      // Step 4: Enter launch mode
      setLaunchMode({ ...clickedPiece });
      const highlightList = [];
      highlightMoves(
        clickedPiece,
        (highlightRow, highlightCol, color) => {
          highlightList.push({ row: highlightRow, col: highlightCol, color });
        },
        allPieces
      );
      setHighlights(highlightList);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }
  }

  // Step 3: Load Pawn or NecroPawn
  if (
    selectedPosition &&
    !launchMode() &&
    getPieceAt(selectedPosition, allPieces)?.type === "DeadLauncher"
  ) {
    const launcherPiece = getPieceAt(selectedPosition, allPieces);
    if (!launcherPiece || !isInLoadingMode()) return false;

    const clickedTargetPiece = getPieceAt({ row: rowIndex, col: columnIndex }, allPieces);
    const isTargetAdjacent =
      Math.abs(launcherPiece.row - rowIndex) + Math.abs(launcherPiece.col - columnIndex) === 1;

    if (
      isTargetAdjacent &&
      ["Pawn", "NecroPawn"].includes(clickedTargetPiece?.type) &&
      clickedTargetPiece.color === launcherPiece.color
    ) {
      const updatedLauncher = { ...launcherPiece, pawnLoaded: true };
      setIsInLoadingMode(false);
      const remainingPieces = allPieces.filter(
        piece => ![clickedTargetPiece.id, launcherPiece.id].includes(piece.id)
      );
      setPieces([...remainingPieces, updatedLauncher]);
      setSelectedSquare(null);
      setHighlights([]);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    } else {
      clearBoardState();
    }
  }

  // Step 1 or default: fallback to standard selection
  return false;
}
