import Board from '~/components/Board';
import PieceViewer from '~/components/PieceViewer';
import PieceDescription from '~/components/PieceDescription';

export default function Index() {
  return (
    <div class="bg-gray-200 min-h-screen flex justify-center items-center p-6">
      {/* row */}
      <div class="flex gap-8 items-center">
        {/* board */}
        <div class="bg-white rounded-xl shadow-lg p-4">
          <Board />
        </div>

        {/* right‑hand column */}
        <div class="flex flex-col justify-between gap-6">
          {/* piece viewer (top‑aligned) */}
          <div class="bg-white rounded-xl shadow-lg p-4">
            <PieceViewer />
          </div>

          {/* description (bottom‑aligned) */}
          <div class="bg-white rounded-xl shadow-lg p-4">
            <PieceDescription />
          </div>
        </div>
      </div>
    </div>
  );
}
