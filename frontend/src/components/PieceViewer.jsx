import { Show, createMemo, onMount } from "solid-js";
import { pieceViewerPiece } from "~/state/gameState";

export default function PieceViewer() {
  const piece = pieceViewerPiece;
  const texturePath = createMemo(
    () => `/sprites/${piece().color}${piece().type}.png`
  );

  onMount(() => {
    const img = new Image();
    img.src = texturePath();
  });

  return (
    <Show when={piece()} keyed>
      {(p) => (
        <div class="card w-96 bg-white shadow-lg">
          <div class="card-body" style={{ "background-color": "#005500" }}>
            <h2 class="card-title justify-center text-6xl text-black">
              {p.type.replace(/(?!^)([A-Z])/g, " $1")}
            </h2>
            <div class="flex justify-center">
              <img
                src={texturePath()}
                alt={`${p.color} ${p.type}`}
                class="w-full h-auto object-contain"
                style={{
                  "image-rendering": "pixelated",
                  "image-rendering": "crisp-edges",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}
