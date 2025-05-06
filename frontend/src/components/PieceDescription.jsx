import { Show } from "solid-js";
import { pieceDescription } from "~/state/gameState";

export default function PieceDescription() {
  const desc = pieceDescription;

  return (
    <Show when={desc()}>
      <div class="card w-96 bg-white shadow-lg">
        <div
          class="card-body space-y-2"
          style={{ "background-color": "#55FF55" }}
        >
          <h2 class="card-title justify-center text-2xl font-bold text-black">
            Abilities
          </h2>
          <div class="text-sm text-gray-900 font-mono leading-relaxed">
            {desc()
              .trim()
              .split("\n")
              .map((line) => (
                <div class="pl-2">– {line.trim().replace(/^- /, "")}</div>
              ))}
          </div>
        </div>
      </div>
    </Show>
  );
}
