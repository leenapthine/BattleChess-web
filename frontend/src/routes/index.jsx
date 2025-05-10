import Board from '~/components/Board';
import PieceViewer from '~/components/PieceViewer';
import PieceDescription from '~/components/PieceDescription';

/* routes/index.jsx */
export default function Index() {
  return (
    <div class="bg-gray-200 min-h-screen flex justify-center items-center p-4">
      {/* max‑w‑screen‑lg caps the whole stack at ~1024 px */}
      <div class="flex flex-col lg:flex-row gap-6 items-start w-full max-w-screen-lg">
        {/* BOARD */}
        <div class="bg-white rounded-xl shadow-lg w-full max-w-[328px] sm:max-w-[704px] mx-auto">
        <ResponsiveCard><Board /></ResponsiveCard>
        </div>

        {/* CARDS */}
        <div class="flex flex-col gap-4 w-full max-w-[328px] sm:max-w-[400px] mx-auto">
          <ResponsiveCard><PieceViewer /></ResponsiveCard>
          <ResponsiveCard><PieceDescription /></ResponsiveCard>
        </div>
      </div>
    </div>
  );
}

/* A tiny wrapper component so we don’t repeat class strings */
function ResponsiveCard(props) {
  return (
    <div class="bg-white rounded-xl shadow-lg w-full text-sm sm:text-base">
      {props.children}
    </div>
  );
}
