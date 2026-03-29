import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { formatUsd } from "@/lib/paper-trading";
import { listOpenPositions } from "@/lib/paper-trading-server";
import { getPaperState } from "@/lib/paper-trading-state";

export default async function PositionsPage() {
  const user = await currentUser();
  const paper = user?.id ? await getPaperState(user.id) : null;
  const openRows = paper ? await listOpenPositions(paper) : [];

  return (
    <div className="bb-grain mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bb-muted">
          Paper trading
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-bb-chalk">
          Your positions
        </h1>
        <p className="max-w-2xl text-sm text-bb-dim">
          All open paper positions across your boards.
        </p>
      </header>

      {openRows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-bb-border bg-bb-surface/50 px-6 py-14 text-center">
          <p className="font-semibold text-bb-chalk">No open positions yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-bb-dim">
            Open a board and place a paper trade to get started.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {openRows.map((row) => (
            <li
              key={row.boardId}
              className="flex flex-col gap-2 rounded-2xl border border-bb-border bg-bb-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={`/dashboard/boards/${row.boardId}`}
                  className="font-display font-bold text-bb-chalk underline-offset-4 hover:underline"
                >
                  {row.board.title}
                </Link>
                <p className="mt-1 text-sm text-bb-dim">
                  {row.position.qty} {row.position.side === "yes" ? "Yes" : "No"} @
                  avg {row.position.avgEntryCents}¢ · mark{" "}
                  {row.position.side === "yes"
                    ? row.board.yesPct
                    : 100 - row.board.yesPct}
                  ¢
                </p>
              </div>
              <p
                className={`font-display text-lg font-extrabold tabular-nums ${
                  row.unrealizedCents >= 0 ? "text-bb-chalk" : "text-red-400/90"
                }`}
              >
                {formatUsd(row.unrealizedCents)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
