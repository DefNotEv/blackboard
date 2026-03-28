import Link from "next/link";

export type BoardPreview = {
  id: string;
  /** Matches `University.id` from onboarding */
  schoolId: string;
  title: string;
  school: string;
  yesPct: number;
  volumeLabel: string;
  closesIn: string;
};

export function BoardCard({ board }: { board: BoardPreview }) {
  const noPct = 100 - board.yesPct;

  return (
    <article className="flex flex-col rounded-2xl border border-bb-border bg-bb-surface p-5 shadow-sm transition hover:border-bb-dim/40 hover:bg-bb-raised">
      <p className="text-xs font-semibold uppercase tracking-widest text-bb-muted">
        {board.school}
      </p>
      <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-bb-chalk">
        {board.title}
      </h3>
      <div className="mt-4 space-y-2">
        <div className="flex h-2 overflow-hidden rounded-full bg-bb-raised">
          <div
            className="bg-bb-chalk transition-all"
            style={{ width: `${board.yesPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-semibold text-bb-dim">
          <span className="text-bb-chalk">Yes {board.yesPct}%</span>
          <span>No {noPct}%</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-bb-border pt-4 text-xs text-bb-muted">
        <span>{board.volumeLabel} vol.</span>
        <span>{board.closesIn}</span>
      </div>
      <Link
        href={`/dashboard/boards/${board.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-bb-border bg-bb-raised px-4 py-2.5 text-sm font-bold tracking-tight text-bb-chalk transition hover:border-bb-dim hover:bg-bb-surface"
      >
        Open board
      </Link>
    </article>
  );
}
