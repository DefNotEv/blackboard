import { BoardCard } from "@/components/dashboard/board-card";
import { getAllBoardsFromStore } from "@/lib/boards-store";

export default async function AllBoardsPage() {
  const boards = await getAllBoardsFromStore();

  return (
    <div className="bb-grain mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bb-muted">
          Market directory
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-bb-chalk">
          All boards
        </h1>
        <p className="max-w-2xl text-sm text-bb-dim">
          Browse every available board across all schools.
        </p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </section>
    </div>
  );
}
