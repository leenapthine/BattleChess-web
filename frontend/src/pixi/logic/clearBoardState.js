import {
	setSelectedSquare,
	setHighlights,
	setResurrectionTargets,
	setPendingResurrectionColor,
	setSacrificeMode,
	setSacrificeArmed,
	setLaunchMode,
	setIsInDominationMode,
	setIsInBoulderMode,
	setIsInLoadingMode,
	setPieceViewerPiece,
} from '~/state/gameState';

/**
 * Clears all board UI state and redraws.
 */
export async function clearBoardState({ preserveLaunch = false } = {}) {
	setSelectedSquare(null);
	setHighlights([]);
	setResurrectionTargets([]);
	setPendingResurrectionColor(null);
	setSacrificeMode(null);
	setSacrificeArmed(false);
	setIsInLoadingMode(false);
	setIsInDominationMode(false);
	setIsInBoulderMode(false);

	if (!preserveLaunch) {
		setLaunchMode(null);
	}
}
  