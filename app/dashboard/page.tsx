import { currentUser } from "@clerk/nextjs/server";
import { BoardCard } from "@/components/dashboard/board-card";
import { getBoardsForSchool } from "@/lib/mock-boards";
import { getUserSchool } from "@/lib/user-school";

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await currentUser();
  const school = getUserSchool(user);
  const campusBoards = school ? getBoardsForSchool(school.universityId) : [];

  const name =
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "there";

  return (
    <div className="bb-grain mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-bb-chalk">
          {greetingForNow()}, {name}
        </h1>
        <p className="max-w-2xl text-pretty text-bb-dim">
          Boards below are scoped to{" "}
          <span className="font-semibold text-bb-chalk">
            {school?.universityName ?? "your campus"}
          </span>
          . Demo data—swap in your API when ready.
        </p>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-bb-border bg-bb-surface p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-bb-muted">
            Open boards
          </p>
          <p className="font-display mt-2 text-3xl font-extrabold tabular-nums text-bb-chalk">
            {campusBoards.length}
          </p>
          <p className="mt-1 text-sm text-bb-muted">At your campus</p>
        </div>
        <div className="rounded-2xl border border-bb-border bg-bb-surface p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-bb-muted">
            Your positions
          </p>
          <p className="font-display mt-2 text-3xl font-extrabold tabular-nums text-bb-chalk">
            0
          </p>
          <p className="mt-1 text-sm text-bb-muted">Trade to see activity</p>
        </div>
        <div className="rounded-2xl border border-bb-border bg-bb-surface p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-bb-muted">
            Ledger
          </p>
          <p className="font-display mt-2 text-3xl font-extrabold tabular-nums text-bb-chalk">
            —
          </p>
          <p className="mt-1 text-sm text-bb-muted">Rewards later</p>
        </div>
      </section>

      <section id="boards" className="mt-14 scroll-mt-24">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-bb-chalk">
              On your campus
            </h2>
            <p className="text-sm text-bb-dim">
              Only boards for your school show here.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {campusBoards.length === 0 ? (
            <p className="text-sm text-bb-dim">
              No demo boards for this campus yet—add rows in{" "}
              <code className="rounded border border-bb-border bg-bb-raised px-1.5 py-0.5 font-mono text-xs text-bb-chalk">
                lib/mock-boards.ts
              </code>{" "}
              for this school ID.
            </p>
          ) : (
            campusBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))
          )}
        </div>
      </section>

      <section id="positions" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-bb-chalk">
          Your positions
        </h2>
        <div className="mt-4 rounded-2xl border border-dashed border-bb-border bg-bb-surface/50 px-6 py-14 text-center">
          <p className="font-semibold text-bb-chalk">No open positions yet</p>
          <p className="mt-2 mx-auto max-w-md text-sm text-bb-dim">
            When you take a side on a board, positions and P&amp;L show up here.
          </p>
        </div>
      </section>
    </div>
  );
}
