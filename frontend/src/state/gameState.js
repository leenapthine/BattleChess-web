import { createSignal } from 'solid-js';

export const [selectedSquare, setSelectedSquare] = createSignal(null);
export const [highlights, setHighlights] = createSignal([]);
export const [resurrectionTargets, setResurrectionTargets] = createSignal([]);
export const [pendingResurrectionColor, setPendingResurrectionColor] = createSignal(null);
export const [sacrificeMode, setSacrificeMode] = createSignal(null);
export const [sacrificeArmed, setSacrificeArmed] = createSignal(false);
export const [launchMode, setLaunchMode] = createSignal(null);
export const [isInLoadingMode, setIsInLoadingMode] = createSignal(false);
export const [isInSacrificeSelectionMode, setIsInSacrificeSelectionMode] = createSignal(false);
export const [capturedPiece, setCapturedPiece] = createSignal(null);
export const [isInBoulderMode, setIsInBoulderMode] = createSignal(false);


// Corrected standard chess layout
export const [pieces, setPieces] = createSignal([
  // White Pieces (top of the board)
  { id: 1, type: "BoulderThrower", color: "White", row: 0, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 2, type: "BeastKnight", color: "White", row: 0, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 3, type: "BeastDruid", color: "White", row: 0, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 4, type: "Queen", color: "White", row: 0, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 5, type: "FrogKing", color: "White", row: 0, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 6, type: "BeastDruid", color: "White", row: 0, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 7, type: "BeastKnight", color: "White", row: 0, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 8, type: "BoulderThrower", color: "White", row: 0, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 9,  type: "PawnHopper", color: "White", row: 1, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 10, type: "PawnHopper", color: "White", row: 1, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 11, type: "PawnHopper", color: "White", row: 1, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 12, type: "PawnHopper", color: "White", row: 1, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 13, type: "PawnHopper", color: "White", row: 1, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 14, type: "PawnHopper", color: "White", row: 1, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 15, type: "PawnHopper", color: "White", row: 1, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 16, type: "PawnHopper", color: "White", row: 1, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0 },

  // Black Pieces (bottom of the board)
  { id: 17, type: "DeadLauncher", color: "Black", row: 7, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0  },
  { id: 18, type: "GhostKnight", color: "Black", row: 7, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 19, type: "Necromancer", color: "Black", row: 7, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0 },
  { id: 20, type: "QueenOfBones", color: "Black", row: 7, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0 },
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
