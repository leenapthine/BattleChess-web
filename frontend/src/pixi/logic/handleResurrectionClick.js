import {
  pieces,
  setPieces,
  setResurrectionTargets,
  resurrectionTargets,
  setPendingResurrectionColor,
  pendingResurrectionColor,
  isInSacrificeSelectionMode,
  setIsInSacrificeSelectionMode
} from '~/state/gameState';

import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';
import { highlightRaiseDeadTiles } from '~/pixi/pieces/necro/Necromancer';
import { triggerQueenOfBonesRevival } from '~/pixi/pieces/necro/QueenOfBones';
import { getPieceAt } from '~/pixi/utils';

// Track selected pawns to sacrifice for QueenOfBones revival
const pendingSacrifices = [];

/**
 * Handles clicks for resurrection logic. Either resurrects a pawn (Necromancer),
 * or tracks pawn sacrifices to revive the QueenOfBones.
 *
 * @param {number} rowIndex - Clicked board row.
 * @param {number} columnIndex - Clicked board column.
 * @param {PIXI.Application} pixiApp - PixiJS application instance.
 * @returns {Promise<boolean>} Whether this handler consumed the click.
 */
export async function handleResurrectionClick(rowIndex, columnIndex, pixiApp) {
  const currentPieces = pieces();
  const currentTargets = resurrectionTargets();
  const clickedPiece = getPieceAt({ row: rowIndex, col: columnIndex }, currentPieces);
  const isValidTarget = currentTargets.some(pos => pos.row === rowIndex && pos.col === columnIndex);

  // === Handle QueenOfBones pawn sacrifice selection ===
  if (isInSacrificeSelectionMode()) {
    const isSacrificeTarget = currentTargets.some(
      target => target.row === rowIndex && target.col === columnIndex
    );

    if (clickedPiece && isSacrificeTarget) {
      console.log("Pawn selected for sacrifice:", clickedPiece);

      // Remove the pawn from the board
      const updatedPieces = currentPieces.filter(
        piece => !(piece.row === rowIndex && piece.col === columnIndex)
      );
      setPieces(updatedPieces);

      // Track the sacrifice
      pendingSacrifices.push(clickedPiece);

      // If two pawns have been sacrificed, revive QueenOfBones
      if (pendingSacrifices.length >= 2) {
        const queenColor = pendingResurrectionColor();
        const spawnRow = queenColor === 'White' ? 0 : 7;
        const spawnCol = 3;
        const spawnOccupied = getPieceAt({ row: spawnRow, col: spawnCol }, updatedPieces);

        if (!spawnOccupied) {
          const revivedQueen = {
            id: crypto.randomUUID(),
            type: 'QueenOfBones',
            color: queenColor,
            row: spawnRow,
            col: spawnCol,
            stunned: false,
            isStone: false,
            raisesLeft: 0
          };

          setPieces([...updatedPieces, revivedQueen]);
        } else {
          console.log("Spawn point occupied. Revival cancelled.");
        }

        // Reset sacrifice state
        pendingSacrifices.length = 0;
        setResurrectionTargets([]);
        setIsInSacrificeSelectionMode(false);
        setPendingResurrectionColor(null);
        await drawBoard(pixiApp, handleSquareClick);
        return true;
      } else {
        // Still waiting for 2nd pawn; remove highlight for the selected one
        const remainingTargets = currentTargets.filter(
          target => !(target.row === rowIndex && target.col === columnIndex)
        );
        setResurrectionTargets(remainingTargets);
        await drawBoard(pixiApp, handleSquareClick);
        return true;
      }
    }
  }

  // === Handle Necromancer resurrection ===
  if (isValidTarget && pendingResurrectionColor()) {
    const resurrectedPawn = {
      id: Date.now(),
      type: 'Pawn',
      color: pendingResurrectionColor(),
      row: rowIndex,
      col: columnIndex
    };

    setPieces([...currentPieces, resurrectedPawn]);
    setResurrectionTargets([]);
    setPendingResurrectionColor(null);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  return false;
}

/**
 * Triggers resurrection prompt after specific capture events.
 * - Necromancer: highlights empty adjacent tiles.
 * - QueenOfBones: triggers sacrifice prompt if eligible.
 *
 * @param {Object} movingPiece - The piece that moved.
 * @param {Object|null} capturedPiece - The piece that was captured.
 * @param {{ row: number, col: number }} destination - Final move location.
 * @param {Array} updatedPieces - Updated board state after the move.
 */
export function triggerResurrectionPrompt(movingPiece, capturedPiece, destination, updatedPieces) {
  if (
    movingPiece?.type === 'Necromancer' &&
    capturedPiece &&
    capturedPiece.color !== movingPiece.color
  ) {
    highlightRaiseDeadTiles(destination, updatedPieces, movingPiece.color);
  }

  if (capturedPiece?.type === 'QueenOfBones') {
    triggerQueenOfBonesRevival(updatedPieces, capturedPiece.color);
  }
}
