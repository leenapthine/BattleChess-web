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
  setPendingResurrectionColor
} from '~/state/gameState';
import { highlightValidMovesForPiece } from '~/pixi/highlight';
import { isSquareSelected, getPieceAt } from '~/pixi/utils';
import { drawBoard } from '~/pixi/drawBoard';
import { highlightRaiseDeadTiles } from '~/pixi/pieces/necro/Necromancer';

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
  const clickedPiece = pieces().find(piece =>
    piece.row === rowIndex && piece.col === columnIndex
  );

  const isTargetHighlighted = highlights().some(highlight =>
    highlight.row === rowIndex && highlight.col === columnIndex
  );

  const isResurrectionTarget = resurrectionTargets().some(pos =>
    pos.row === rowIndex && pos.col === columnIndex
  );

  // Case 1: Clicked on a resurrection target square -> Place new Pawn
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

  // Case 2: Clicked a valid move target -> Move selected piece
  if (isTargetHighlighted && selectedSquare()) {
    const destination = { row: rowIndex, col: columnIndex };
    const previouslySelected = selectedSquare();
    const movingPiece = pieces().find(piece =>
      piece.row === previouslySelected.row && piece.col === previouslySelected.col
    );
    const capturedPiece = getPieceAt(destination, pieces());

    const updatedPieceList = pieces()
      .filter(piece => !(piece.row === rowIndex && piece.col === columnIndex)) // remove captured
      .map(piece => {
        if (piece.row === previouslySelected.row && piece.col === previouslySelected.col) {
          return { ...piece, row: rowIndex, col: columnIndex }; // move piece
        }
        return piece;
      });

    setPieces(updatedPieceList);
    setSelectedSquare(null);
    setHighlights([]);

    // Necromancer: If capture occurred, trigger resurrection mode
    if (movingPiece?.type === 'Necromancer' &&
      capturedPiece &&
      capturedPiece.color !== movingPiece.color) {
    highlightRaiseDeadTiles(destination, updatedPieceList, movingPiece.color);
  }

    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // Case 3: Clicked on a piece to select -> Show movement options
  if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
    setSelectedSquare({ row: rowIndex, col: columnIndex });

    const newHighlightList = [];
    highlightValidMovesForPiece(
      clickedPiece,
      (targetRow, targetCol, highlightColor) => {
        newHighlightList.push({
          row: targetRow,
          col: targetCol,
          color: highlightColor
        });
      },
      pieces()
    );

    setHighlights(newHighlightList);
    setResurrectionTargets([]);
    setPendingResurrectionColor(null);
    await drawBoard(pixiApplication, handleSquareClick);
    return;
  }

  // Case 4: Clicked on empty or already selected square -> Clear selection
  setSelectedSquare(null);
  setHighlights([]);
  setResurrectionTargets([]);
  setPendingResurrectionColor(null);
  await drawBoard(pixiApplication, handleSquareClick);
}

  