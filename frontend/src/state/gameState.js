import { createSignal } from 'solid-js';

export const [selectedSquare, setSelectedSquare] = createSignal(null);
export const [highlights, setHighlights] = createSignal([]);


// Define a piece
export const [pieces, setPieces] = createSignal([
    {
      id: 1,
      type: "Queen",
      color: "White",
      row: 0,
      col: 3,
    },
    {
      id: 2,
      type: "Queen",
      color: "Black",
      row: 7,
      col: 3,
    },
    {
      id: 3,
      type: "Pawn",
      color: "White",
      row: 1,
      col: 1,
    },
    {
      id: 4,
      type: "Pawn",
      color: "Black",
      row: 6,
      col: 0,
    },
  ]);