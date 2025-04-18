import {
	setSelectedSquare,
	setHighlights,
	setResurrectionTargets,
	setPendingResurrectionColor,
	setSacrificeMode,
	setSacrificeArmed,
} from '~/state/gameState';

/**
 * Clears all board UI state and redraws.
 */
export async function clearBoardState() {
	setSelectedSquare(null);
	setHighlights([]);
	setResurrectionTargets([]);
	setPendingResurrectionColor(null);
	setSacrificeMode(null);
	setSacrificeArmed(false);
}
  