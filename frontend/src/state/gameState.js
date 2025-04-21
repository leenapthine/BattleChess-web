import { createSignal } from 'solid-js';

export const [selectedSquare, setSelectedSquare] = createSignal(null);
export const [highlights, setHighlights] = createSignal([]);
export const [resurrectionTargets, setResurrectionTargets] = createSignal([]);
export const [pendingResurrectionColor, setPendingResurrectionColor] = createSignal(null);
export const [sacrificeMode, setSacrificeMode] = createSignal(null);
export const [sacrificeArmed, setSacrificeArmed] = createSignal(false);
export const [launchMode, setLaunchMode] = createSignal(null);
export const [isInLoadingMode, setIsInLoadingMode] = createSignal(false);


// Corrected standard chess layout
export const [pieces, setPieces] = createSignal([
  // White Pieces (top of the board)
  { id: 1, type: "Rook", color: "White", row: 0, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 2, type: "Knight", color: "White", row: 0, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 3, type: "Bishop", color: "White", row: 0, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 4, type: "Queen", color: "White", row: 0, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 5, type: "King", color: "White", row: 0, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 6, type: "Bishop", color: "White", row: 0, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 7, type: "Knight", color: "White", row: 0, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 8, type: "Rook", color: "White", row: 0, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 9,  type: "Pawn", color: "White", row: 1, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 10, type: "Pawn", color: "White", row: 1, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 11, type: "Pawn", color: "White", row: 1, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 12, type: "Pawn", color: "White", row: 1, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 13, type: "Pawn", color: "White", row: 1, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 14, type: "Pawn", color: "White", row: 1, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 15, type: "Pawn", color: "White", row: 1, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 16, type: "Pawn", color: "White", row: 1, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0 },

  // Black Pieces (bottom of the board)
  { id: 17, type: "DeadLauncher", color: "Black", row: 7, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0  },
  { id: 18, type: "GhostKnight", color: "Black", row: 7, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 19, type: "Necromancer", color: "Black", row: 7, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 20, type: "Queen", color: "Black", row: 7, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 21, type: "GhoulKing", color: "Black", row: 7, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 1 },
  { id: 22, type: "Necromancer", color: "Black", row: 7, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 23, type: "GhostKnight", color: "Black", row: 7, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 24, type: "DeadLauncher", color: "Black", row: 7, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 25, type: "NecroPawn", color: "Black", row: 6, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 26, type: "NecroPawn", color: "Black", row: 6, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 27, type: "NecroPawn", color: "Black", row: 6, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 28, type: "NecroPawn", color: "Black", row: 6, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 29, type: "NecroPawn", color: "Black", row: 6, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 30, type: "NecroPawn", color: "Black", row: 6, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 31, type: "NecroPawn", color: "Black", row: 6, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 32, type: "NecroPawn", color: "Black", row: 6, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0 },
]);
