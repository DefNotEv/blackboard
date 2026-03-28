"use client";

import { useActionState } from "react";
import type { BoardPreview } from "@/components/dashboard/board-card";
import {
  buyPaper,
  sellPaper,
  type PaperTradeResult,
} from "@/app/actions/paper-trade";
import {
  formatUsd,
  markPriceCents,
  type PaperPosition,
} from "@/lib/paper-trading";

function Message({ result }: { result: PaperTradeResult | null }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <p className="mt-3 text-sm font-medium text-bb-chalk" role="status">
        {result.message}
      </p>
    );
  }
  return (
    <p className="mt-3 text-sm font-medium text-red-400/90" role="alert">
      {result.error}
    </p>
  );
}

export function PaperTradePanel({
  board,
  position,
  balanceCents,
}: {
  board: BoardPreview;
  position: PaperPosition | null;
  balanceCents: number;
}) {
  const yes = board.yesPct;
  const no = 100 - board.yesPct;

  const [buyState, buyAction, buyPending] = useActionState(buyPaper, null);
  const [sellState, sellAction, sellPending] = useActionState(sellPaper, null);

  const unrealized = position
    ? position.qty *
      (markPriceCents(board, position.side) - position.avgEntryCents)
    : null;

  return (
    <div className="rounded-2xl border border-bb-border bg-bb-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-bb-dim">Paper trade</p>
          <p className="mt-1 text-xs text-bb-muted">
            Consensus sets the price (¢ per $1 payoff). No real money, no
            external feeds.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-bb-muted">
            Paper cash
          </p>
          <p className="font-display text-lg font-extrabold tabular-nums text-bb-chalk">
            {formatUsd(balanceCents)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-bb-border bg-bb-raised px-4 py-3">
          <p className="text-xs font-bold text-bb-muted">Yes</p>
          <p className="font-display mt-1 text-2xl font-extrabold tabular-nums text-bb-chalk">
            {yes}¢
          </p>
        </div>
        <div className="rounded-xl border border-bb-border bg-bb-raised px-4 py-3">
          <p className="text-xs font-bold text-bb-muted">No</p>
          <p className="font-display mt-1 text-2xl font-extrabold tabular-nums text-bb-chalk">
            {no}¢
          </p>
        </div>
      </div>

      {position && position.qty > 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-bb-border bg-bb-bg/40 px-4 py-3 text-sm">
          <p className="font-bold text-bb-chalk">
            Open: {position.qty}{" "}
            {position.side === "yes" ? "Yes" : "No"} @ avg{" "}
            {position.avgEntryCents}¢
          </p>
          <p className="mt-1 text-bb-dim">
            Mark {markPriceCents(board, position.side)}¢ · Unrealized{" "}
            <span
              className={
                unrealized != null && unrealized >= 0
                  ? "text-bb-chalk"
                  : "text-red-400/90"
              }
            >
              {unrealized != null ? formatUsd(unrealized) : "—"}
            </span>
          </p>
        </div>
      ) : null}

      <form action={buyAction} className="mt-6 space-y-4">
        <input type="hidden" name="boardId" value={board.id} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-bb-muted">
            Side
          </p>
          <div className="mt-2 flex gap-3">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-bb-border bg-bb-raised px-4 py-3 has-[:checked]:border-bb-chalk has-[:checked]:bg-bb-surface">
              <input
                type="radio"
                name="side"
                value="yes"
                defaultChecked
                className="accent-bb-chalk"
              />
              <span className="text-sm font-bold text-bb-chalk">Yes</span>
            </label>
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-bb-border bg-bb-raised px-4 py-3 has-[:checked]:border-bb-chalk has-[:checked]:bg-bb-surface">
              <input
                type="radio"
                name="side"
                value="no"
                className="accent-bb-chalk"
              />
              <span className="text-sm font-bold text-bb-chalk">No</span>
            </label>
          </div>
        </div>
        <div>
          <label
            htmlFor={`qty-${board.id}`}
            className="text-xs font-bold uppercase tracking-widest text-bb-muted"
          >
            Contracts
          </label>
          <input
            id={`qty-${board.id}`}
            name="qty"
            type="number"
            min={1}
            step={1}
            defaultValue={10}
            className="mt-2 w-full rounded-xl border border-bb-border bg-bb-bg px-4 py-3 text-sm font-semibold text-bb-chalk outline-none ring-bb-chalk/30 placeholder:text-bb-muted focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={buyPending}
          className="w-full rounded-xl border border-bb-border bg-bb-chalk px-4 py-3 text-sm font-bold text-bb-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buyPending ? "Working…" : "Buy (paper)"}
        </button>
        <Message result={buyState} />
      </form>

      {position && position.qty > 0 ? (
        <form action={sellAction} className="mt-6 border-t border-bb-border pt-6">
          <input type="hidden" name="boardId" value={board.id} />
          <button
            type="submit"
            disabled={sellPending}
            className="w-full rounded-xl border border-bb-border bg-transparent px-4 py-3 text-sm font-bold text-bb-chalk transition hover:bg-bb-raised disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sellPending ? "Working…" : "Sell position (paper)"}
          </button>
          <Message result={sellState} />
        </form>
      ) : null}
    </div>
  );
}
