import {
  sacrificeMode,
  sacrificeArmed,
  setSacrificeMode,
  setSacrificeArmed,
  setSelectedSquare,
  setPieces,
  setHighlights,
  selectedSquare,
  pieces
} from '~/state/gameState';
import { getPieceAt } from '~/pixi/utils';
import { performNecroPawnSacrifice } from '~/pixi/pieces/necro/NecroPawn';
import { highlightValidMovesForPiece } from '~/pixi/highlight';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';

/**
 * Handles all NecroPawn-specific clicks.
 * Covers both arming and detonating.
 * @returns {boolean} true if handled
 */
export async function handleSacrificeClick(row, col, pixiApp, allPieces) {
  const detonation =
    sacrificeMode()?.row === row &&
    sacrificeMode()?.col === col &&
    sacrificeArmed();

  if (detonation) {
    const pawn = sacrificeMode();
    performNecroPawnSacrifice(pawn, setPieces, allPieces);

    setSacrificeMode(null);
    setSacrificeArmed(false);
    setSelectedSquare(null);
    await drawBoard(pixiApp, handleSquareClick);
    return true;
  }

  // Step into sacrifice mode if same NecroPawn clicked
  const selected = selectedSquare();
  if (selected?.row === row && selected?.col === col) {
    const piece = getPieceAt(selected, pieces());

    if (piece?.type === 'NecroPawn' && !sacrificeMode()) {
      setSacrificeMode({ ...piece });
      setSacrificeArmed(true);

      const highlightList = [];
      highlightValidMovesForPiece(
        piece,
        (r, c, color) => highlightList.push({ row: r, col: c, color }),
        pieces()
      );
      setHighlights(highlightList);
      await drawBoard(pixiApp, handleSquareClick);
      return true;
    }
  }

  return false;
}
