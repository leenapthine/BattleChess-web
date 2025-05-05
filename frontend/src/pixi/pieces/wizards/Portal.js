// Description: Logic for the Portal, a level 2 Rook from the Wizard class.
//
// Main Functions:
// - highlightMoves(portal, addHighlight, allPieces):
//     Highlights valid movement options for the Portal (like a standard Rook).
// - handlePortalClick(row, col, pixiApp):
//     Manages the loading, unloading, and ejection of a piece into an adjacent square.
//
// Special Features:
// - The Portal moves like a standard Rook (along rows and columns).
// - On the first click, it highlights all valid movement options, as well as adjacent squares where friendly pieces can be loaded.
// - Friendly pieces (e.g., Pawns or YoungWiz) in adjacent squares can be loaded into the Portal by clicking on it.
// - Once a piece is loaded, a second click will highlight adjacent squares where the loaded piece can be ejected to unoccupied spaces.
// - The loaded piece is shared across all friendly Portals, meaning when a piece is loaded into one Portal, it is reflected in all others.
// - When the piece is unloaded from any Portal, the loaded state is cleared for all friendly Portals.


import { highlightMoves as highlightRookMoves } from '~/pixi/pieces/basic/Rook'; // Use Rook's highlight logic
import { getPieceAt, getAdjacentTiles } from '~/pixi/utils';
import { 
  setPieces,
  pieces,
  setHighlights,
  selectedSquare,
  setSelectedSquare,
  launchMode,
  setLaunchMode,
  isInLoadingMode,
  setIsInLoadingMode,
} from '~/state/gameState';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';
import { clearBoardState } from '~/pixi/logic/clearBoardState';

/**
 * Highlights all valid moves for the Portal piece.
 * Reuses Rook's movement highlighting and adds the loading functionality.
 * 
 * @param {Object} portal - The Portal piece being selected.
 * @param {Function} addHighlight - Callback to register highlight at (row, col, color).
 * @param {Array} allPieces - List of all pieces on the board.
 */
export function highlightMoves(portal, addHighlight, allPieces) {
  const isInEjectMode = launchMode()?.id === portal.id;

  const row = portal.row;
	const col = portal.col;
  
  if (!isInLoadingMode() && !isInEjectMode) {
    addHighlight(row, col, 0x00ffff);
  }

  // Step 2: Loading mode
  if (isInLoadingMode() && !portal.pieceLoaded) {
    addHighlight(row, col, 0xffff00);
    const adjacentTiles = getAdjacentTiles(portal);
    for (const tile of adjacentTiles) {
      addHighlight(tile.row, tile.col, 0x00ffff);
    }
    return;
  }

  // Step 3: Eject mode
  if (isInEjectMode && portal.pieceLoaded) {
    addHighlight(row, col, 0xffff00);
    const adjacentTiles = getAdjacentTiles(portal);
    for (const tile of adjacentTiles) {
      addHighlight(tile.row, tile.col, 0x00ffff);
    }
    return;
  }

  if (!isInLoadingMode() && !isInEjectMode) {
    // Step 1 or 4: Normal rook movement and captures
    highlightRookMoves(portal, addHighlight, allPieces);
  }
}

/**
 * Handles the loading and ejection of a piece by a Portal.
 * 
 * @param {Object} rowIndex - Row of the clicked square.
 * @param {Object} columnIndex - Column of the clicked square.
 * @param {Object} pixiApp - PixiJS application instance.
 */
export async function handlePortalClick(rowIndex, columnIndex, pixiApp, isTurn) {
  const allPieces = pieces();
  const clickedPiece = getPieceAt({ row: rowIndex, col: columnIndex }, allPieces);
  const selectedPosition = selectedSquare();
  const loadedPortal = launchMode();

  // Step 5: Eject at valid target
  if (loadedPortal && isTurn) {
    const isSquareValid = getAdjacentTiles(loadedPortal);
    const isTargetUnoccupied = !getPieceAt({ row: rowIndex, col: columnIndex }, allPieces);

    // If clicked square is valid (cyan) and unoccupied, unload the piece
    if (isSquareValid.some(tile => tile.row === rowIndex && tile.col === columnIndex) && isTargetUnoccupied) {
      // If the target square is valid and unoccupied, unload the piece into the square
      const pieceToMove = loadedPortal.pieceLoaded;
      pieceToMove.row = rowIndex;
      pieceToMove.col = columnIndex;

      // Remove the piece from the board and set its new position
      const updatedPieces = allPieces.filter(piece => piece.id !== pieceToMove.id);
      updatedPieces.push(pieceToMove);

      // Reset the pieceLoaded state for ALL friendly Portals
      allPieces.forEach(piece => {
        if (piece.type === "Portal" && piece.color === loadedPortal.color) {
          piece.pieceLoaded = null;
        }
      });

      setPieces(updatedPieces);
      setLaunchMode(null);
      setSelectedSquare(null);
      setHighlights([]);
      await drawBoard(pixiApp, handleSquareClick);

      return true;
    } else {
      clearBoardState();
    }
  }

  // Handle clicks when portal is selected (either to enter loading or launch mode)
  if (
    selectedPosition?.row === rowIndex &&
    selectedPosition?.col === columnIndex &&
    clickedPiece?.type === "Portal"
  ) {
    if (!clickedPiece.pieceLoaded && !isInLoadingMode()) {
      // Step 2: Enter loading mode
      const updatedPortal = { ...clickedPiece };
      setIsInLoadingMode(true);
      const updatedPieces = allPieces.map(piece =>
        piece.id === updatedPortal.id ? updatedPortal : piece
      );
      setPieces(updatedPieces);
      setSelectedSquare({ row: rowIndex, col: columnIndex });

      const highlightList = [];
      highlightMoves(
        updatedPortal,
        (highlightRow, highlightCol, color) => highlightList.push({ row: highlightRow, col: highlightCol, color }),
        updatedPieces
      );
      setHighlights(highlightList);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }

    if (clickedPiece.pieceLoaded && !launchMode()) {
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

  // Step 3: Load Piece into Portal (if adjacent to portal and compatible)
  if (
    selectedPosition &&
    !launchMode() &&
    getPieceAt(selectedPosition, allPieces)?.type === "Portal" &&
    isTurn
  ) {
    const launcherPiece = getPieceAt(selectedPosition, allPieces);
    if (!launcherPiece || !isInLoadingMode()) return false;

    const clickedTargetPiece = getPieceAt({ row: rowIndex, col: columnIndex }, allPieces);
    const isTargetAdjacent =
      Math.abs(launcherPiece.row - rowIndex) + Math.abs(launcherPiece.col - columnIndex) === 1;

    if (
      isTargetAdjacent &&
      clickedTargetPiece !== null &&
      clickedTargetPiece.color === launcherPiece.color
    ) {
      // Update ALL friendly Portals to have the clicked piece loaded
      allPieces.forEach(piece => {
        if (piece.type === "Portal" && piece.color === launcherPiece.color) {
          piece.pieceLoaded = clickedTargetPiece;
        }
      });

      setIsInLoadingMode(false);
      const remainingPieces = allPieces.filter(
        piece => ![clickedTargetPiece.id, launcherPiece.id].includes(piece.id)
      );
      setPieces([...remainingPieces, launcherPiece]);
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
