import {
    selectedSquare,
    setSelectedSquare,
    pieces,
    setPieces,
    highlights,
    setHighlights
  } from '~/state/gameState';
  import { highlightValidMovesForPiece } from '~/pixi/highlight';
  import { isSquareSelected } from '~/pixi/utils';
  import { drawBoard } from '~/pixi/drawBoard';
  
  /**
   * Handles user interaction when a board square is clicked.
   * 
   * This function determines if the click should:
   * - Select a piece
   * - Move a selected piece to a highlighted target square
   * - Deselect a currently selected piece
   * 
   * After processing the click, the board is redrawn.
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
  
    // Case 1: Clicked a valid move target -> Move piece
    if (isTargetHighlighted && selectedSquare()) {
      const updatedPieceList = pieces()
        .filter(piece => !(piece.row === rowIndex && piece.col === columnIndex)) // remove captured
        .map(piece => {
          if (
            piece.row === selectedSquare().row &&
            piece.col === selectedSquare().col
          ) {
            return { ...piece, row: rowIndex, col: columnIndex }; // move selected piece
          }
          return piece;
        });
  
      setPieces(updatedPieceList);
      setSelectedSquare(null);
      setHighlights([]);
  
    // Case 2: Clicked on a new piece -> Select and show valid moves
    } else if (clickedPiece && !isSquareSelected(rowIndex, columnIndex)) {
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
  
    // Case 3: Clicked on empty or already selected square -> Clear selection
    } else {
      setSelectedSquare(null);
      setHighlights([]);
    }
  
    await drawBoard(pixiApplication, handleSquareClick);
  }
  