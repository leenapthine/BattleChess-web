import { onMount } from 'solid-js';
import { Application } from 'pixi.js';
import { drawBoard } from '~/pixi/drawBoard';

export default function Board() {
  let containerRef;

  onMount(async () => {
    const app = new Application();
    await app.init({ width: 800, height: 800, backgroundColor: 0xffffff });
    containerRef.appendChild(app.canvas);
    drawBoard(app);
  });

  return <div ref={containerRef} />;
}