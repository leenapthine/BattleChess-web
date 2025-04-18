# Battle Chess

**Battle Chess** is a custom-built, fantasy-themed chess game with special unit types, unique abilities, and a modular, extensible design.

The game uses **PixiJS** to render an interactive chessboard in the browser. Units like the `Necromancer` can raise the dead, while pieces like `NecroPawn` can sacrifice themselves to destroy surrounding enemies. These mechanics are defined in isolated, composable logic modules.

This project is full-stack — with a frontend written in modern JavaScript and a backend built in Django (in progress).

---

## How It Works

- **PixiJS** draws the board and pieces and handles user interactions.
- All piece movement and behavior is driven by modular logic files.
- SolidJS-style reactive state stores manage selected pieces, valid move highlights, and special states like resurrection or sacrifice.
- Custom sprites are organized by name and color in `public/sprites/`.

In the future:

- The **Django backend** will handle multiplayer sessions, user accounts, and persistent game state.

---

## Tech Stack

### Frontend

- **PixiJS** – 2D rendering and board interaction
- **SolidJS (Signals)** – Reactive state store
- **Vite** – Fast bundler + dev server
- **TailwindCSS** – UI styling
- **JavaScript** – All logic in modern ES syntax

### Backend (Planned)

- **Python 3.12**
- **Django 5.2**
- **PostgreSQL**
- **Django REST Framework (DRF)** for game state syncing (planned)
- **WebSocket support** (for future multiplayer)

---

## Developer Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/battle-chess.git
cd battle-chess
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend Dev Server

```bash
npm run dev
```

Open the game at [http://localhost:5173](http://localhost:5173)

---

## Backend (optional)

> _Only needed if you plan to work on or run the backend_

### 1. Create Python Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Backend Requirements

```bash
pip install -r requirements.txt
```

### 3. Run Django Server (coming soon)

```bash
python manage.py migrate
python manage.py runserver
```

---

## 📁 File Overview

- `src/pixi/` – Core game logic: click handling, movement, ability triggers
- `src/pixi/pieces/` – Individual piece behavior (`Necromancer`, `Queen`, etc.)
- `public/sprites/` – PNG images for each unit by color and type
- `src/state/` – Reactive game state (selected piece, highlights, etc.)
- `src/components/` – UI scaffolding for the board and squares
- `backend/` – (Planned) Django app for multiplayer backend

---

## For New Developers

If you're a new dev or a new ChatGPT thread, focus on:

- `src/pixi/clickHandler.js` – entry point for all in-game interactions
- `src/pixi/logic/` – contains modular logic units like `handlePieceMove.js`, `handleSacrificeClick.js`
- `src/state/gameState.js` – reactive state signals (like `pieces()`)

This project was designed for **modularity and testability**. Each new unit or behavior should be implemented in its own file and hooked into the main handler chain.

---
