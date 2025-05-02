import { onMount } from 'solid-js';
import { Application } from 'pixi.js';
import { drawBoard } from '~/pixi/drawBoard';
import { handleSquareClick } from '~/pixi/clickHandler';

/**
 * Top-level component that initializes and renders the PixiJS chessboard.
 * Mounts the PixiJS application and triggers the initial board draw.
 */

export default function Board() {
  let containerElement;

  onMount(async () => {
    const pixiApp = new Application();
    await pixiApp.init({ width: 800, height: 800, backgroundColor: 0xffffff });

    containerElement.appendChild(pixiApp.canvas);
    await drawBoard(pixiApp, handleSquareClick);
  });

  return <div ref={containerElement} />;
}
