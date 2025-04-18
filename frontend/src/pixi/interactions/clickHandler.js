import {
  selectedSquare,
  setSelectedSquare,
  pieces,
  setPieces,
  highlights,
  setHighlights,
  resurrectionTargets,
  setResurrectionTargets,
  pendingResurrectionColor,
  setPendingResurrectionColor,
  sacrificeMode,
  setSacrificeMode,
  sacrificeArmed,
  setSacrificeArmed,
} from '~/state/gameState';
import { highlightValidMovesForPiece } from '~/pixi/highlight';
import { isSquareSelected, getPieceAt } from '~/pixi/utils';
import { drawBoard } from '~/pixi/drawBoard';
import { highlightRaiseDeadTiles } from '~/pixi/pieces/necro/Necromancer';
import { performNecroPawnSacrifice } from '~/pixi/pieces/necro/NecroPawn';

/**
 * Handles user interaction when a board square is clicked.
 *
 * This function determines if the click should:
 * - Select a piece and highlight its valid moves
 * - Move a selected piece to a valid destination (including capturing)
 * - Trigger resurrection after a Necromancer capture
 * - Place a resurrected Pawn on a valid green square
 * - Deselect an already selected square
 *
 * After processing, the board is redrawn.
 *
 * @param {number} rowIndex - The row of the clicked square.
 * @param {number} columnIndex - The column of the clicked square.
 * @param {Application} pixiApplication - The PixiJS application instance managing the canvas.
 */
export async function handleSquareClick(rowIndex, columnIndex, pixiApplication) {
  const all = pieces(); // prevent signal from changing during handler
  const clickedPiece = pieces().find(piece =>
    piece.row === rowIndex && piece.col === columnIndex 
  );

  const isTargetHighlighted = highlights().some(highlight =>
    highlight.row === rowIndex &&
    highlight.col === columnIndex &&
    !(selectedSquare()?.row === rowIndex && selectedSquare()?.col === columnIndex) // exclude self
  );

  const isResurrectionTarget = resurrectionTargets().some(pos =>
    pos.row === rowIndex && pos.col === columnIndex
  );

  // Case 0: If sacrifice is armed AND clicked again → detonate
  const isClickingToDetonate =
    sacrificeMode()?.row === rowIndex &&
    sacrificeMode()?.col === columnIndex &&
    sacrificeArmed();

  console.log("isClickingToDetonate =", isClickingToDetonate)

  if (isClickingToDetonate) {
    const necroPawn = sacrificeMode(); // save reference before state resets
    performNecroPawnSacrifice(necroPawn, setPieces, all);

    // now clear state AFTER explosion happens
    setSacrificeMode(null);
    setSacrificeArmed(false);
    setSelectedSquare(null);
    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // Case 1: Resurrection target clicked → Place Pawn
  if (isResurrectionTarget && pendingResurrectionColor()) {
    const resurrectedPawn = {
      id: Date.now(),
      type: 'Pawn',
      color: pendingResurrectionColor(),
      row: rowIndex,
      col: columnIndex
    };

    setPieces([...pieces(), resurrectedPawn]);
    setResurrectionTargets([]);
    setPendingResurrectionColor(null);
    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // Case 2: Move piece to highlighted square
  if (isTargetHighlighted && selectedSquare()) {
    const destination = { row: rowIndex, col: columnIndex };
    const from = selectedSquare();
    const movingPiece = pieces().find(p => p.row === from.row && p.col === from.col);
    const capturedPiece = getPieceAt(destination, pieces());
    console.log("Captured:", capturedPiece);

    const updated = pieces()
      .filter(p => !(p.row === destination.row && p.col === destination.col))
      .map(p => {
        if (p.row === from.row && p.col === from.col) {
          return { ...p, row: destination.row, col: destination.col };
        }
        return p;
      });

    setPieces(updated);
    setSelectedSquare(null);
    setHighlights([]);
    setSacrificeMode(null);

    if (
      movingPiece?.type === 'Necromancer' &&
      capturedPiece &&
      capturedPiece.color !== movingPiece.color
    ) {
      highlightRaiseDeadTiles(destination, updated, movingPiece.color);
    }
    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // Case 3a: Select a new piece
  if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
    setSelectedSquare({ row: rowIndex, col: columnIndex });
    const highlightList = [];
    highlightValidMovesForPiece(
      clickedPiece,
      (r, c, color) => highlightList.push({ row: r, col: c, color }),
      pieces()
    );

    setHighlights(highlightList);
    setResurrectionTargets([]);
    setPendingResurrectionColor(null);
    setSacrificeMode(null);
    setSacrificeArmed(false);
    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // Case 3b: Click same NecroPawn → step deeper into sacrifice state
  if (
    selectedSquare() &&
    selectedSquare().row === rowIndex &&
    selectedSquare().col === columnIndex
  ) {
    const selectedPiece = getPieceAt(selectedSquare(), pieces());

    if (selectedPiece?.type === 'NecroPawn') {
      if (!sacrificeMode()) {
        // Step 1: Enter sacrifice mode (next click detonates)
        setSacrificeMode({ ...selectedPiece });
        setSacrificeArmed(true);
      } else {
        // Step 2: Already armed, detonation handled earlier
        return;
      }
      // Re-run highlight logic to re-trigger highlightMoves()
      const highlightList = [];
      highlightValidMovesForPiece(
        selectedPiece,
        (r, c, color) => highlightList.push({ row: r, col: c, color }),
        pieces()
      );
      setHighlights(highlightList);
      await drawBoard(pixiApplication, handleSquareClick);
      return;
    }
  }

  // Case 4: Clear selection
  setSelectedSquare(null);
  setHighlights([]);
  setResurrectionTargets([]);
  setPendingResurrectionColor(null);
  setSacrificeMode(null);
  setSacrificeArmed(false);
  await drawBoard(pixiApplication, handleSquareClick);
}
