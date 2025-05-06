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

    // Initialize PixiJS Application
    const pixiApp = new Application();
    await pixiApp.init({ 
      resizeTo: containerElement,
      backgroundColor: 0xffffff
    });
    // Append the canvas after initialization
    containerElement.appendChild(pixiApp.canvas);
    await drawBoard(pixiApp, handleSquareClick);
  });
  

  return (
    <div 
      ref={containerElement} 
      class="relative w-[672px] max-w-full aspect-square bg-gray-200"
    />
  );
}

