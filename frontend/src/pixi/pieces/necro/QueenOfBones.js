// Description: Logic module for the QueenOfBones piece, a level 2 Queen from the Necromancer Guild.
//
// Main Functions:
// - highlightMoves(queenOfBones, addHighlight, allPieces):
//     Highlights all valid movement and capture tiles using standard Queen movement logic.
//
// - triggerQueenOfBonesRevival(updatedPieces, queenColor):
//     If a QueenOfBones is captured and at least two friendly Pawns or NecroPawns are present,
//     prompts the player to select two of them for sacrifice in order to respawn the Queen.
//
// Special Features or Notes:
// - The QueenOfBones is a custom level 2 Queen piece unique to the Necromancer Guild.
// - It moves like a standard Queen (diagonal, horizontal, vertical — any number of spaces).
// - It can capture enemy pieces by moving into their square.
// - Upon being captured, the QueenOfBones triggers a special revival ability:
//     - If the player controls at least two friendly Pawns or NecroPawns, those units can be sacrificed.
//     - The player is prompted to select two such pieces by clicking them when they are highlighted in purple.
//     - Once two pawns have been sacrificed, the QueenOfBones respawns automatically at its original spawn point
//       (d1 or d8 depending on color), but only if the square is unoccupied.
// - If the spawn square is occupied, the resurrection fails silently.
// - The sacrifice prompt is managed using `resurrectionTargets`, `pendingResurrectionColor`, and a
//   `isInSacrificeSelectionMode` flag from the central game state.
//
// Usage or Context:
// - This module integrates with the PixiJS highlight engine and resurrection handler.
// - Movement is delegated to the standard Queen logic.
// - Sacrifice and respawn behavior is triggered from `triggerResurrectionPrompt()` in `handlePieceMove.js`.

import {
    setResurrectionTargets,
    setPendingResurrectionColor,
    setIsInSacrificeSelectionMode,
  } from '~/state/gameState';
  
  import { highlightMoves as highlightStandardQueenMoves } from '~/pixi/pieces/basic/Queen';
  
  /**
   * Highlights valid movement and capture tiles for the QueenOfBones.
   * Delegates to standard Queen movement logic.
   *
   * @param {Object} queenOfBones - The QueenOfBones piece.
   * @param {Function} addHighlight - Callback to register highlight objects.
   * @param {Array} allPieces - All pieces currently on the board.
   */
  export function highlightMoves(queenOfBones, addHighlight, allPieces) {
    highlightStandardQueenMoves(queenOfBones, addHighlight, allPieces);
  }
  
  /**
   * Triggers revival prompt for QueenOfBones after it is captured.
   * If 2 or more friendly pawns exist, highlights them for sacrifice.
   *
   * @param {Array} updatedPieces - All board pieces after the QueenOfBones has been captured.
   * @param {string} queenColor - The color of the QueenOfBones that was captured.
   */
  export function triggerQueenOfBonesRevival(updatedPieces, queenColor) {
    const eligiblePawns = updatedPieces.filter(
      piece =>
        piece.color === queenColor &&
        (
          piece.type === 'Pawn' ||
          piece.type === 'NecroPawn' ||
          piece.type === 'HellPawn' ||
          piece.type === 'YoungWiz' ||
          piece.type === 'PawnHopper'
        )
    );
  
    if (eligiblePawns.length >= 2) {
      const sacrificeTiles = eligiblePawns.map(pawn => ({
        row: pawn.row,
        col: pawn.col,
        color: 0x880088, // Purple highlight for sacrifice prompt
      }));
  
      setResurrectionTargets(sacrificeTiles);
      setPendingResurrectionColor(queenColor);
      setIsInSacrificeSelectionMode(true);
    }
  }
  