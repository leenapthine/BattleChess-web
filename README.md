# Battle Chess

**Battle Chess** is a custom-built, fantasy-themed chess game with four uniques guilds all with special unit types, abilities, and a modular design.

This project is full-stack — with a frontend written in modern JavaScript and a backend built in Django (in progress).

Try the early demo for both browser and mobile screens here: https://battle-chess-web.vercel.app

---

## How It Works

- **PixiJS** draws the board and pieces and handles user interactions.
- All piece movement and behavior is driven by modular logic files.
- SolidJS-style reactive state stores manage selected pieces, valid move highlights, and special states like resurrection or sacrifice.
- Custom sprites are organized by name and color in `public/sprites/`.

This is a refactor of my [previous version in C++](https://github.com/leenapthine/BattleChess). While the version is stylistically more developped, it currently lacks the multiplayer features of its predecessor. In the future, my **Django backend** will handle multiplayer sessions, user accounts, and army customization.

---

## Tech Stack

### Frontend

- **PixiJS** – 2D rendering and board interaction
- **Solid-start (Signals)** – Reactive state store
- **TailwindCSS** – UI styling
- **JavaScript** – All logic in modern ES syntax

### Backend (Planned)

- **Python**
- **Django**
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

---

## Backend (not fully confgured yet)

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

## Media

<p align="center">
  <img width="50%" src="https://github.com/user-attachments/assets/00760b57-100e-4f4f-8d1e-10a5460147f1" />
  <img width="50%" src="https://github.com/user-attachments/assets/a5a790c5-782b-4761-a9b2-1e014351dba0" />
</p>

---

## File Overview

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

This project was designed for **modularity**. Each new unit or behavior should be implemented in its own file and hooked into the main handler chain.

---
