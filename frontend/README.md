# Battle Chess (PixiJS Edition)

A modular, deeply customized chess engine built using **PixiJS** — supporting a growing collection of unique units, rule-breaking mechanics, and complex abilities like resurrection and area-of-effect sacrifices.

---

## Features

- Custom sprite-based visuals with unique piece types (e.g. `Necromancer`, `QueenOfDomination`, `GhostKnight`)
- Modular piece logic — each type encapsulates its own behavior
- Special rules like sacrifice (e.g. `NecroPawn`) and resurrection (`Necromancer`)
- Clean, signal-based game state using a SolidJS-style reactive store
- Developer-friendly architecture for extending the game

---

## Tech Stack

| Technology         | Role                                     |
| ------------------ | ---------------------------------------- |
| **PixiJS**         | Core board + sprite rendering            |
| **SolidJS + Vite** | UI framework (optional, minimal use)     |
| **TailwindCSS**    | Styling for interface elements           |
| **Vanilla JS**     | Game logic, modularized into clean files |

---

## 📂 Project Structure

```txt
src/
├── pixi/
│   ├── clickHandler.js             # Master board click dispatcher
│   ├── drawBoard.js                # Draws the board + pieces
│   ├── highlight.js                # Shows valid movement tiles
│   ├── constants.js                # Static values like board size
│   ├── utils.js                    # Helpers like getPieceAt()
│   └── logic/
│       ├── clearBoardState.js          # Resets highlights + selection
│       ├── handlePieceMove.js          # Handles moving & capturing
│       ├── handleResurrectionClick.js  # Places pawns after resurrection
│       └── handleSacrificeClick.js     # Triggers NecroPawn sacrifice
│
│   └── pieces/
│       ├── basic/
│       │   ├── Bishop.js, King.js, etc.
│       └── necro/
│           ├── Necromancer.js
│           └── NecroPawn.js
│
├── state/
│   └── gameState.js  # Reactive signals for state
├── public/sprites/   # Sprites organized by <Color><Type>.png
├── components/       # Board & Square JSX components
├── routes/           # SolidJS routing
└── styles/           # Tailwind entry
```

---

## Game Flow: `handleSquareClick(row, col, app)`

This is the **core interaction point** for every square click. It delegates control to:

1. `handleSacrificeClick()` – If a `NecroPawn` is being armed or detonated
2. `handlePieceMove()` – If the click is a valid move
3. `handleResurrectionClick()` – If resurrecting a pawn
4. Else – Clears the board

---

## Internal Logic Modules

| File                          | Purpose                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| `handlePieceMove()`           | Moves piece, removes captured, handles resurrection           |
| `handleSacrificeClick()`      | Two-step logic: arm → detonate `NecroPawn`                    |
| `handleResurrectionClick()`   | Validates resurrection and places pawn                        |
| `triggerResurrectionPrompt()` | Highlights resurrection targets after a `Necromancer` capture |
| `clearBoardState()`           | Clears all visual and interaction state                       |

---

## Game State (Signals)

Stored using SolidJS-style signals from `~/state/gameState.js`:

| Signal                                     | Purpose                               |
| ------------------------------------------ | ------------------------------------- |
| `pieces()` / `setPieces()`                 | Main list of all current board pieces |
| `selectedSquare()` / `setSelectedSquare()` | What the user has selected            |
| `highlights()` / `setHighlights()`         | All valid movement/capture tiles      |
| `sacrificeMode()` / `setSacrificeMode()`   | Whether a `NecroPawn` is armed        |
| `sacrificeArmed()`                         | Second click detonation state         |
| `resurrectionTargets()`                    | Green tiles for reviving pawns        |
| `pendingResurrectionColor()`               | Which team can place the revived pawn |

---

## Sprite Naming Convention

All sprites live under `public/sprites/` and follow this format:

```
<Color><PieceType>.png
```

Examples:

- `WhiteNecromancer.png`
- `BlackQueenOfDestruction.png`
- `WhitePawnHopper.png`

---

## Adding New Units

To add a custom unit like `TimeWizard`:

1. **Sprite**  
   Drop `WhiteTimeWizard.png` and `BlackTimeWizard.png` into `public/sprites/`.

2. **Logic**  
   Create `TimeWizard.js` under `pixi/pieces/[group]/`.

3. **Click Behavior** (if custom):  
   Create `handleTimeWizardClick.js` under `pixi/logic/` and invoke it from `handleSquareClick()`.

4. **Board Setup**  
   Add it to your initial board population logic.

---

## Developer Notes & Rules of Thumb

### Avoid Infinite Redraws

**Do not call `handleSquareClick()` inside `drawBoard()`**, and avoid vice versa unless you’re very careful. It causes infinite render loops.

---

### Reuse `clearBoardState()`

Clears all UI interaction state — great for resetting after any action.

```js
await clearBoardState(pixiApp);
```

---

### Piece Objects, Not Classes

All pieces are simple JavaScript objects like:

```js
{
  id: 12345,
  type: 'Necromancer',
  color: 'White',
  row: 3,
  col: 4
}
```

No prototype or class logic involved.

---

### Extendable with `handle<X>Click.js`

Custom units with click-specific logic should get their own handler, e.g.:

- `handleTeleportClick.js`
- `handleTimeWizardClick.js`
- `handlePortalClick.js`

Dispatch to it from inside `handleSquareClick()`.

---

### Debug Tips

- Use `console.log(...)` liberally inside:
  - `handlePieceMove()`
  - `handleSacrificeClick()`
  - `triggerResurrectionPrompt()`
- You can also inspect state directly in DevTools via `window.$stateName` (if exposed)

---

## Quick Dev Checklist

- [ ] All click behaviors routed through `handleSquareClick()`
- [ ] All temporary visual state reset via `clearBoardState()`
- [ ] Piece movement handled only in `handlePieceMove()`
- [ ] Resurrection highlighting only via `triggerResurrectionPrompt()`
- [ ] Sprites follow naming convention

---

## Save Point Summary (For ChatGPT Threads)

If this README is passed to a fresh ChatGPT thread, assume:

- Pieces are plain JS objects (no classes)
- Game state is reactive via Solid-like signals
- Game logic is **fully modularized**, no global side effects
- `drawBoard()` is the only rendering function
- Custom behaviors must be implemented as separate click logic handlers and routed via `handleSquareClick()`
- Resurrection, sacrifice, and movement are already cleanly encapsulated

---
