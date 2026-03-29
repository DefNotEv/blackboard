import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { BoardCard } from "@/components/dashboard/board-card";
import { getBoardsForSchoolFromStore } from "@/lib/boards-store";
import {
  formatUsd,
} from "@/lib/paper-trading";
import { listOpenPositions, totalUnrealizedCents } from "@/lib/paper-trading-server";
import { getPaperState } from "@/lib/paper-trading-state";
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
  const campusBoards = school
    ? await getBoardsForSchoolFromStore(school.universityId)
    : [];
  const previewBoards = campusBoards.slice(0, 3);
  const paper = user?.id ? await getPaperState(user.id) : null;
  const openRows = paper ? await listOpenPositions(paper) : [];
  const previewPositions = openRows.slice(0, 3);
  const positionCount = openRows.length;
  const unrealized = paper ? await totalUnrealizedCents(paper) : 0;

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
            {positionCount}
          </p>
          <p className="mt-1 text-sm text-bb-muted">
            {positionCount === 0
              ? "Trade a board to open one"
              : "Open paper positions"}
          </p>
        </div>
        <div className="rounded-2xl border border-bb-border bg-bb-surface p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-bb-muted">
            Paper cash
          </p>
          <p className="font-display mt-2 text-3xl font-extrabold tabular-nums text-bb-chalk">
            {paper ? formatUsd(paper.balanceCents) : "—"}
          </p>
          <p className="mt-1 text-sm text-bb-muted">
            {paper ? `Unrealized ${formatUsd(unrealized)}` : "Sign in"}
          </p>
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
          {campusBoards.length > 3 ? (
            <Link
              href="/dashboard/boards"
              className="mt-2 inline-flex items-center self-start rounded-lg border border-bb-border bg-bb-surface px-3 py-2 text-sm font-semibold text-bb-dim transition hover:text-bb-chalk sm:mt-0"
            >
              View more
            </Link>
          ) : null}
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
            previewBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))
          )}
        </div>
      </section>

      <section id="positions" className="mt-16 scroll-mt-24">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-bb-chalk">
            Your positions
          </h2>
          {openRows.length > 3 ? (
            <Link
              href="/dashboard/positions"
              className="mt-2 inline-flex items-center self-start rounded-lg border border-bb-border bg-bb-surface px-3 py-2 text-sm font-semibold text-bb-dim transition hover:text-bb-chalk sm:mt-0"
            >
              View more
            </Link>
          ) : null}
        </div>
        {openRows.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-bb-border bg-bb-surface/50 px-6 py-14 text-center">
            <p className="font-semibold text-bb-chalk">No open positions yet</p>
            <p className="mt-2 mx-auto max-w-md text-sm text-bb-dim">
              Open a campus board and use paper trade.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {previewPositions.map((row) => (
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
                    {row.position.qty} {row.position.side === "yes" ? "Yes" : "No"}{" "}
                    @ avg {row.position.avgEntryCents}¢ · mark{" "}
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
      </section>
    </div>
  );
}
