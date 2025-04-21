import {
	setSelectedSquare,
	setHighlights,
	setResurrectionTargets,
	setPendingResurrectionColor,
	setSacrificeMode,
	setSacrificeArmed,
	setLaunchMode,
} from '~/state/gameState';
import { setIsInLoadingMode } from '../../state/gameState';

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

	if (!preserveLaunch) {
		setLaunchMode(null);
	}
}
  