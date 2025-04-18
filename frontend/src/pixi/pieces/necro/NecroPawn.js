/*
Summary:
The NecroPawn is a corrupted pawn that serves the Necromancer race. It can march forward like any 
ordinary pawn, but beneath its humble shell lies a terrifying ability — the power to self-destruct 
in a burst of necrotic energy, obliterating everything around it, including allies.

Clicking once highlights its moves. Clicking a second time activates sacrifice mode. Clicking again 
confirms and triggers the explosion. To cancel, select another square instead.
*/

import { getPieceAt } from '~/pixi/utils';
import { setSacrificeMode, sacrificeMode, setHighlights } from '~/state/gameState';

/**
 * Highlight valid moves for a NecroPawn.
 * 
 * This includes:
 * - Standard pawn moves (single/double step forward)
 * - Diagonal captures
 * - Self square in red (for initiating sacrifice)
 * - If in sacrifice mode, highlights AoE capture squares in red
 *
 * @param {Object} piece - The NecroPawn piece object.
 * @param {Function} addHighlight - Function to register highlight on a tile.
 * @param {Array} allPieces - Array of all current pieces on the board.
 */
export function highlightMoves(piece, addHighlight, allPieces) {
	const forward = piece.color === 'White' ? 1 : -1;
	const row = piece.row;
	const col = piece.col;

	const inSacrificeMode = sacrificeMode()?.id === piece.id;

	// Highlight self: blue (initial), red (if in sacrifice mode)
	addHighlight(row, col, inSacrificeMode ? 0xff0000 : 0x00ffff);

	// AoE preview if in sacrifice mode
	if (inSacrificeMode) {
		console.log("in sacrifice mode");
		getSurroundingTiles(row, col).forEach(({ row: r, col: c }) => {
			if (r >= 0 && r < 8 && c >= 0 && c < 8) {
				addHighlight(r, c, 0xff0000);
			}
		});
		return;
	}

	// Normal movement
	const singleStep = { row: row + forward, col };
	if (!getPieceAt(singleStep, allPieces)) {
		addHighlight(singleStep.row, singleStep.col);
	}

	const startRow = piece.color === 'White' ? 1 : 6;
	const doubleStep = { row: row + 2 * forward, col };
	if (
		row === startRow &&
		!getPieceAt(singleStep, allPieces) &&
		!getPieceAt(doubleStep, allPieces)
	) {
		addHighlight(doubleStep.row, doubleStep.col);
	}

	for (const offset of [-1, 1]) {
		const target = { row: row + forward, col: col + offset };
		if (
			target.row >= 0 && target.row < 8 &&
			target.col >= 0 && target.col < 8
		) {
			const targetPiece = getPieceAt(target, allPieces);
			if (targetPiece && targetPiece.color !== piece.color) {
				addHighlight(target.row, target.col, 0xff0000);
			}
		}
	}
}
  

/**
 * Executes the sacrifice ability: removes all pieces in 8 surrounding tiles + the NecroPawn itself.
 *
 * @param {Object} necroPawn - The NecroPawn piece object.
 * @param {Function} setPieces - Setter for the global pieces signal.
 * @param {Array} allPieces - The current list of pieces on the board.
 */
export function performNecroPawnSacrifice(necroPawn, setPiecesFn, allPieces) {
  const captureArea = getSurroundingTiles(necroPawn.row, necroPawn.col);
  captureArea.push({ row: necroPawn.row, col: necroPawn.col });

  const survivors = allPieces.filter(piece => {
    return !captureArea.some(pos =>
      pos.row === piece.row && pos.col === piece.col
    );
  });

  setPiecesFn(survivors);
  setHighlights([]);
  setSacrificeMode(null);
}

/**
 * Returns all 8 adjacent tile positions around a square.
 *
 * @param {number} row - Row index of the center tile.
 * @param {number} col - Column index of the center tile.
 * @returns {Array<{row: number, col: number}>}
 */
function getSurroundingTiles(row, col) {
  return [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col },
    { row: row - 1, col: col + 1 },
    { row: row,     col: col - 1 },
    { row: row,     col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col },
    { row: row + 1, col: col + 1 },
  ];
}
