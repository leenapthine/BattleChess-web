export default {
  Instruction: `
    - Click on a piece to select it.
    - Click on a square to move the piece there.
    - Click on an enemy piece to see its movement range.
  `,
  Pawn: `
    - Moves forward 1 tile; captures diagonally.
    - Can move 2 tiles forward on its first move.
    - Promotes to any piece upon reaching the last rank.
  `,
  Rook: `
    - Moves any number of tiles horizontally or vertically.
    - Cannot jump over other pieces.
    - Used in castling with the King.
  `,
  Knight: `
    - Moves in an L-shape (2 in one direction, then 1 perpendicular).
    - Can jump over other pieces.
    - Only piece that ignores blocking units.
  `,
  Bishop: `
    - Moves diagonally any number of tiles.
    - Cannot jump over other pieces.
    - Strong on open diagonals.
  `,
  Queen: `
    - Combines Rook and Bishop movement (all directions).
    - Moves any number of tiles in straight or diagonal lines.
    - Most powerful piece.
  `,
  King: `
    - Moves 1 tile in any direction.
    - Cannot move into check.
    - Can castle with Rook under certain conditions.
  `,
  BeastDruid: `
    - Moves diagonally like a Bishop and 1 tile in any direction like a King.
    - Flexible hybrid unit with both ranged and close combat reach.
    - Friendly pieces block movement; captures by stepping onto enemies.
    - Level 2 Bishop from the BeastMaster guild.
  `,
  BeastKnight: `
    - Moves in an extended L-shape: 3 in one direction, 1 in the other (like a long Knight).
    - Ignores all pieces in its path; only destination matters.
    - Captures by landing on an enemy tile.
    - Level 2 Knight from the BeastMaster guild.
  `,
  BoulderThrower: `
    - Moves like a Rook but cannot capture by movement.
    - Can launch a boulder to capture any enemy exactly 3 tiles away (orthogonally or diagonally).
    - Click once to move; click again to enter launch mode and show targets.
    - Level 2 Rook from the BeastMaster guild.
  `,
  FrogKing: `
    - Moves 1 square in any direction like a King.
    - Can also hop 2 squares orthogonally, ignoring pieces in between.
    - Hop moves can capture enemy units.
    - Level 2 King from the BeastMaster guild.
  `,
  PawnHopper: `
    - Moves forward 1 or 2 tiles; captures diagonally like a normal pawn.
    - Can also capture by hopping 2 tiles forward over an enemy piece.
    - Hop capture only works if the square behind the enemy is empty.
    - Level 2 Pawn from the BeastMaster guild.
  `,
  QueenOfDomination: `
    - Moves like a standard Queen in all directions.
    - Once per turn, can "dominate" an adjacent friendly unit,
      turning it into a Queen until end of turn.
    - Dominated unit must move immediately or it reverts.
    - Level 2 Queen from the BeastMaster guild.
  `,
  Beholder: `
    - Moves 1 tile in any cardinal direction (up, down, left, right).
    - Cannot move onto any occupied tile, friendly or enemy.
    - Can shoot enemies up to 3 tiles away (Manhattan range) using a ranged attack.
    - Toggle between movement and capture mode by clicking the unit again.
    - Level 2 unit from the Demon guild.
  `,
  HellPawn: `
    - Moves forward and captures diagonally like a standard pawn.
    - If it captures a non-pawn enemy, it permanently transforms into that unit (inherits type, keeps color).
    - Capturing a pawn works normally without transformation.
    - Level 2 Pawn from the Demon guild.
  `,
  HellKing: `
    - Moves 1 tile in any direction, like a standard King.
    - Instead of capturing, it converts enemy units into allies.
    - Converted piece stays in place and switches to HellKing’s team.
    - Level 2 King from the Demon guild.
  `,
  Howler: `
    - Starts with Bishop movement (diagonal range).
    - Gains movement abilities of any enemy piece it captures (e.g., Knight, Rook, Queen, Pawn).
    - Gains are permanent and stack, allowing dynamic movement growth.
    - Always moves into the captured piece’s square.
    - Level 2 Bishop from the Demon guild.
  `,
  Prowler: `
    - Moves like a standard Knight (L-shape).
    - After capturing, makes a second Knight move immediately.
    - Level 2 Knight from the Demon guild.
  `,
  QueenOfDestruction: `
    - Moves like a standard Queen (orthogonal and diagonal).
    - When captured, triggers a detonation in a 3-tile radius.
    - All pieces (friend or foe) within range are destroyed.
    - Level 2 Queen from the Demon guild.
  `,
  DeadLauncher: `
    - Moves like a Rook (straight lines across the board).
    - Can load an adjacent friendly Pawn, then launch it to destroy a target.
    - In launch mode, can target enemies within 3-tile Manhattan range.
    - Launching consumes the loaded Pawn; movement is allowed while loaded.
    - Level 2 Rook from the Demon guild.
  `,
  GhostKnight: `
    - Moves like a Knight (L-shape), ignoring other pieces.
    - After any move, stuns all adjacent enemies (they cannot move next turn).
    - Level 2 Knight from the Necromancer guild.
  `,
  GhoulKing: `
    - Moves 1 tile in any direction like a standard King.
    - Once per game, can raise a NecroPawn on an adjacent empty tile before moving.
    - Raise ability is optional and does not consume the move.
    - Level 2 King from the Necromancer guild.
  `,
  Necromancer: `
    - Moves diagonally like a Bishop.
    - After capturing, can raise a friendly Pawn on an adjacent empty square.
    - Raise must be used immediately after the capture.
    - Level 2 Bishop from the Necromancer guild.
  `,
  NecroPawn: `
    - Moves like a standard pawn (forward and diagonal capture).
    - Can trigger a self-destruct ability by clicking three times.
    - Detonates itself and all adjacent pieces (both ally and enemy).
    - Level 2 Pawn from the Necromancer guild.
  `,
  QueenOfBones: `
    - Moves like a standard Queen in all directions.
    - When captured, can be revived by sacrificing 2 friendly Pawn type units.
    - Revives at original spawn point (if unoccupied) after sacrifice.
    - Level 2 Queen from the Necromancer guild.
  `,
  Familiar: `
    - Moves like a standard Knight (L-shape).
    - Can turn to stone, making it immune to capture.
    - Can revert from stone form by clicking it again.
    - Level 2 Knight from the Wizard guild.
  `,
  Portal: `
      - Moves like a Rook, sliding horizontally and vertically.
      - Can "store" an adjacent friendly unit by clicking it.
      - Stored unit can exit from *any* friendly Portal, enabling cross-board teleportation.
      - Unload to an adjacent unoccupied tile on second click.
      - Loading ends turn; unloading does not.
      - Level 2 Rook from the Wizard guild.
  `,
  QueenOfIllusions: `
    - Moves like a standard Queen (orthogonal and diagonal).
    - Can swap places with a friendly Pawn or YoungWiz instead of moving.
    - Swap is triggered by clicking a highlighted friendly unit after selecting the Queen.
    - Level 2 Queen from the Wizard guild.
  `,
  WizardKing: `
    - Moves 1 square in any direction like a standard King.
    - Can shoot and capture an enemy in vertical line-of-sight directly
      ahead or behind (no movement).
    - Also captures normally by stepping onto adjacent enemy pieces.
    - Level 2 King from the Wizard guild.
  `,
  WizardTower: `
    - Moves diagonally like a standard Bishop.
    - Captures by shooting enemies from range — does not move into the target square.
    - Level 2 Bishop from the Wizard guild.
  `,
  YoungWiz: `
    - Moves like a standard pawn (1 forward, or 2 on first move).
    - Captures diagonally and can also zap an enemy directly in front without moving.
    - Level 2 Pawn from the Wizard guild.
  `,
};
  