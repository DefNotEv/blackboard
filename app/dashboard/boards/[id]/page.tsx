import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BoardCard } from "@/components/dashboard/board-card";
import { PaperTradePanel } from "@/components/dashboard/paper-trade-panel";
import {
  getBoardByIdFromStore,
  getBoardsForSchoolFromStore,
} from "@/lib/boards-store";
import { getPaperState } from "@/lib/paper-trading-state";
import { getUserSchool } from "@/lib/user-school";

type Props = { params: Promise<{ id: string }> };

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const school = getUserSchool(user);
  const board = await getBoardByIdFromStore(id);

  if (!board || !school || board.schoolId !== school.universityId) {
    notFound();
  }

  const paper = await getPaperState(user.id);
  const rawPos = paper.positions[board.id];
  const position =
    rawPos && rawPos.qty > 0 ? rawPos : null;

  const related = (await getBoardsForSchoolFromStore(school.universityId)).filter(
    (b) => b.id !== id,
  );

  const noPct = 100 - board.yesPct;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href="/dashboard/boards"
        className="text-sm font-semibold text-bb-dim underline-offset-4 transition hover:text-bb-chalk hover:underline"
      >
        ← All boards
      </Link>

      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-bb-muted">
        {board.school}
      </p>
      <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-bb-chalk">
        {board.title}
      </h1>

      <div className="mt-8 rounded-2xl border border-bb-border bg-bb-surface p-6">
        <p className="text-sm font-bold text-bb-dim">Consensus</p>
        <div className="mt-4 space-y-2">
          <div className="flex h-3 overflow-hidden rounded-full bg-bb-raised">
            <div
              className="bg-bb-chalk"
              style={{ width: `${board.yesPct}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-bb-chalk">Yes {board.yesPct}%</span>
            <span className="text-bb-dim">No {noPct}%</span>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-bb-border pt-6 text-sm">
          <div>
            <dt className="text-bb-muted">Volume</dt>
            <dd className="font-bold text-bb-chalk">{board.volumeLabel}</dd>
          </div>
          <div>
            <dt className="text-bb-muted">Resolution</dt>
            <dd className="font-bold text-bb-chalk">{board.closesIn}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <PaperTradePanel
          board={board}
          position={position}
          balanceCents={paper.balanceCents}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-bb-muted">
          More boards on campus
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((b) => (
            <BoardCard key={b.id} board={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
