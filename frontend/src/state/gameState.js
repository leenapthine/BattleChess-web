import { createSignal, onMount } from 'solid-js';
import descriptions from "~/data/pieceDescriptions.js";

export const [selectedSquare, setSelectedSquare] = createSignal(null);
// Currently selected square (row, col) where the player has clicked.
// Used to track which piece is active for movement or ability use.

export const [highlights, setHighlights] = createSignal([]);
// List of tiles (row, col, color) that are currently highlighted on the board.
// Used for showing valid moves, captures, ability targets, etc.

export const [resurrectionTargets, setResurrectionTargets] = createSignal([]);
// List of valid squares (row, col) where a piece can be resurrected.
// Used by Necromancer and GhoulKing resurrection abilities.

export const [pendingResurrectionColor, setPendingResurrectionColor] = createSignal(null);
// Color ("White" or "Black") of the piece being resurrected.
// Temporarily stored while selecting resurrection tiles.

export const [sacrificeMode, setSacrificeMode] = createSignal(null);
// Tracks whether a piece (like NecroPawn) is in the middle of preparing a sacrifice ability.
// If non-null, clicking will trigger sacrifice behavior.

export const [sacrificeArmed, setSacrificeArmed] = createSignal(false);
// True when a NecroPawn has been clicked once to "arm" its sacrifice.
// False when the player cancels or detonates.

export const [launchMode, setLaunchMode] = createSignal(null);
// Holds the piece (like DeadLauncher) that is ready to launch a projectile.
// If non-null, the player can click a launch target.

export const [isInLoadingMode, setIsInLoadingMode] = createSignal(false);
// True if a piece (DeadLauncher) is currently trying to load a Pawn.
// False if normal movement mode.

export const [isInSacrificeSelectionMode, setIsInSacrificeSelectionMode] = createSignal(false);
// Used to track if the player is choosing which NecroPawn to sacrifice after a special ability is triggered.

export const [capturedPiece, setCapturedPiece] = createSignal(null);
// Tracks the most recently captured piece during move handling.
// Used for special effects triggered by captures (e.g., QueenOfBones resurrection check).

export const [isInBoulderMode, setIsInBoulderMode] = createSignal(false);
// True if BoulderThrower has toggled into launch/capture mode instead of movement mode.

export const [isInDominationMode, setIsInDominationMode] = createSignal(false);
// True if QueenOfDomination has activated its ability to dominate a piece.

export const [isSecondMove, setIsSecondMove] = createSignal(false);
// True if the Prowler has captured an enemy piece and is now moving again.

// The state for the currently selected piece
export const [selectedPiece, setSelectedPiece] = createSignal(null);

// The state for the currently selected piece in the piece viewer
export const [pieceViewerPiece, setPieceViewerPiece] = createSignal(null);

// The state for the currently selected piece's description
export const [pieceDescription, setPieceDescription] = createSignal(descriptions["Instruction"]);

// The state for current turn (white or black)
export const [currentTurn, setCurrentTurn] = createSignal("White");

// Corrected standard chess layout
export const [pieces, setPieces] = createSignal([
  // White Pieces (top of the board)
  { id: 1, type: "DeadLauncher", color: "White", row: 0, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false, 
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false }, 
  },
  { id: 2, type: "GhostKnight", color: "White", row: 0, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 3, type: "Necromancer", color: "White", row: 0, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 4, type: "QueenOfBones", color: "White", row: 0, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
   },
  { id: 5, type: "GhoulKing", color: "White", row: 0, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 1, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 6, type: "Necromancer", color: "White", row: 0, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 7, type: "GhostKnight", color: "White", row: 0, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 8, type: "DeadLauncher", color: "White", row: 0, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 9,  type: "NecroPawn", color: "White", row: 1, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 10, type: "NecroPawn", color: "White", row: 1, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 11, type: "NecroPawn", color: "White", row: 1, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 12, type: "NecroPawn", color: "White", row: 1, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 13, type: "NecroPawn", color: "White", row: 1, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 14, type: "NecroPawn", color: "White", row: 1, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 15, type: "NecroPawn", color: "White", row: 1, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 16, type: "NecroPawn", color: "White", row: 1, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },

  // Black Pieces (bottom of the board)
  { id: 17, type: "Beholder", color: "Black", row: 7, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 18, type: "Prowler", color: "Black", row: 7, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 19, type: "Howler", color: "Black", row: 7, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 20, type: "QueenOfDestruction", color: "Black", row: 7, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 21, type: "HellKing", color: "Black", row: 7, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 22, type: "Howler", color: "Black", row: 7, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 23, type: "Prowler", color: "Black", row: 7, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 24, type: "Beholder", color: "Black", row: 7, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 25, type: "HellPawn", color: "Black", row: 6, col: 0, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 26, type: "HellPawn", color: "Black", row: 6, col: 1, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 27, type: "HellPawn", color: "Black", row: 6, col: 2, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 28, type: "HellPawn", color: "Black", row: 6, col: 3, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 29, type: "HellPawn", color: "Black", row: 6, col: 4, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 30, type: "HellPawn", color: "Black", row: 6, col: 5, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 31, type: "HellPawn", color: "Black", row: 6, col: 6, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
  { id: 32, type: "HellPawn", color: "Black", row: 6, col: 7, pawnLoaded: false, stunned: false, raisesLeft: 0, pieceLoaded: null, isStone: false,
    gainedAbilities: { knight: false, rook: false, queen: false, pawn: false },
  },
]);

// Function to switch the turn
export function switchTurn() {
  setCurrentTurn(currentTurn() === "White" ? "Black" : "White");
}

export const [tileSize, setTileSize] = createSignal(84);

onMount(() => {
  const size = window.innerWidth < 640 ? 41 : 84;
  setTileSize(size);
});
