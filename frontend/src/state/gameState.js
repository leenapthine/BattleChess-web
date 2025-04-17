import { createSignal } from 'solid-js';

export const [selectedSquare, setSelectedSquare] = createSignal(null);
export const [highlights, setHighlights] = createSignal([]);
export const [resurrectionTargets, setResurrectionTargets] = createSignal([]);
export const [pendingResurrectionColor, setPendingResurrectionColor] = createSignal(null);


// Corrected standard chess layout
export const [pieces, setPieces] = createSignal([
  // White Pieces (top of the board)
  { id: 1, type: "Rook", color: "White", row: 0, col: 0 },
  { id: 2, type: "Knight", color: "White", row: 0, col: 1 },
  { id: 3, type: "Bishop", color: "White", row: 0, col: 2 },
  { id: 4, type: "Queen", color: "White", row: 0, col: 3 },
  { id: 5, type: "King", color: "White", row: 0, col: 4 },
  { id: 6, type: "Bishop", color: "White", row: 0, col: 5 },
  { id: 7, type: "Knight", color: "White", row: 0, col: 6 },
  { id: 8, type: "Rook", color: "White", row: 0, col: 7 },
  { id: 9,  type: "Pawn", color: "White", row: 1, col: 0 },
  { id: 10, type: "Pawn", color: "White", row: 1, col: 1 },
  { id: 11, type: "Pawn", color: "White", row: 1, col: 2 },
  { id: 12, type: "Pawn", color: "White", row: 1, col: 3 },
  { id: 13, type: "Pawn", color: "White", row: 1, col: 4 },
  { id: 14, type: "Pawn", color: "White", row: 1, col: 5 },
  { id: 15, type: "Pawn", color: "White", row: 1, col: 6 },
  { id: 16, type: "Pawn", color: "White", row: 1, col: 7 },

  // Black Pieces (bottom of the board)
  { id: 17, type: "Rook", color: "Black", row: 7, col: 0 },
  { id: 18, type: "Knight", color: "Black", row: 7, col: 1 },
  { id: 19, type: "Necromancer", color: "Black", row: 7, col: 2 },
  { id: 20, type: "Queen", color: "Black", row: 7, col: 3 },
  { id: 21, type: "King", color: "Black", row: 7, col: 4 },
  { id: 22, type: "Necromancer", color: "Black", row: 7, col: 5 },
  { id: 23, type: "Knight", color: "Black", row: 7, col: 6 },
  { id: 24, type: "Rook", color: "Black", row: 7, col: 7 },
  { id: 25, type: "Pawn", color: "Black", row: 6, col: 0 },
  { id: 26, type: "Pawn", color: "Black", row: 6, col: 1 },
  { id: 27, type: "Pawn", color: "Black", row: 6, col: 2 },
  { id: 28, type: "Pawn", color: "Black", row: 6, col: 3 },
  { id: 29, type: "Pawn", color: "Black", row: 6, col: 4 },
  { id: 30, type: "Pawn", color: "Black", row: 6, col: 5 },
  { id: 31, type: "Pawn", color: "Black", row: 6, col: 6 },
  { id: 32, type: "Pawn", color: "Black", row: 6, col: 7 },
]);
