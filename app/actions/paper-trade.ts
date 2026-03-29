"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getBoardByIdFromStore } from "@/lib/boards-store";
import {
  ensureMongoIndexes,
  getBoardsCollection,
  getPaperAccountsCollection,
  getPositionsCollection,
  getTradesCollection,
  type TradeSide,
} from "@/lib/db";
import { publishBoardUpdated } from "@/lib/pusher-server";
import type { PaperPosition, PaperSide } from "@/lib/paper-trading";
import {
  markPriceCents,
  yesNoPrices,
} from "@/lib/paper-trading";
import { getPaperState } from "@/lib/paper-trading-state";
import { getUserSchool } from "@/lib/user-school";

export type PaperTradeResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

function parseVolumeLabelToCents(volumeLabel: string): number {
  const normalized = volumeLabel.trim().toLowerCase();
  const hasK = normalized.endsWith("k");
  const numeric = Number.parseFloat(normalized.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric)) return 0;
  const dollars = hasK ? numeric * 1000 : numeric;
  return Math.round(dollars * 100);
}

function formatVolumeLabel(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1000) {
    const k = dollars / 1000;
    const rounded = k >= 10 ? k.toFixed(0) : k.toFixed(1);
    return `$${rounded}k`;
  }
  return `$${Math.round(dollars).toLocaleString("en-US")}`;
}

function clampPct(value: number): number {
  return Math.min(98, Math.max(2, Math.round(value)));
}

function impactForQty(qty: number): number {
  return Math.min(8, Math.max(0.2, qty / 250));
}

async function updateBoardMarket(
  boardId: string,
  side: TradeSide,
  qty: number,
  isBuy: boolean,
) {
  const boardsCol = await getBoardsCollection();
  const board = await boardsCol.findOne({ id: boardId });
  if (!board) return null;

  const impact = impactForQty(qty);
  const signed = isBuy ? impact : -impact;
  const direction = side === "yes" ? 1 : -1;

  const nextYes = clampPct(board.yesPct + direction * signed);
  const oldVolume = parseVolumeLabelToCents(board.volumeLabel);
  const volumeDelta = Math.max(100, Math.round(qty * (board.yesPct / 100) * 100));
  const nextVolume = oldVolume + volumeDelta;
  const nextVolumeLabel = formatVolumeLabel(nextVolume);

  await boardsCol.updateOne(
    { id: boardId },
    {
      $set: {
        yesPct: nextYes,
        volumeLabel: nextVolumeLabel,
        volumeCents: nextVolume,
        updatedAt: new Date(),
      },
    },
  );

  return {
    boardId: board.id,
    schoolId: board.schoolId,
    yesPct: nextYes,
    volumeLabel: nextVolumeLabel,
  };
}

async function requireCampusBoard(boardId: string) {
  const user = await currentUser();
  const school = getUserSchool(user);
  const board = await getBoardByIdFromStore(boardId);
  if (!board || !school || board.schoolId !== school.universityId) {
    return null;
  }
  return board;
}

export async function buyPaper(
  _prev: PaperTradeResult | null,
  formData: FormData,
): Promise<PaperTradeResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Sign in to trade." };

  const boardId = String(formData.get("boardId") ?? "");
  const side = (formData.get("side") === "no" ? "no" : "yes") as PaperSide;
  const qtyRaw = Number(formData.get("qty"));

  const board = await requireCampusBoard(boardId);
  if (!board) return { ok: false, error: "Board not available." };

  const qty = Math.floor(qtyRaw);
  if (!Number.isFinite(qty) || qty < 1 || qty > 10_000) {
    return { ok: false, error: "Enter a size between 1 and 10,000 contracts." };
  }

  const price = markPriceCents(board, side);
  const costCents = qty * price;

  const state = await getPaperState(userId);

  const existing = state.positions[boardId];
  if (existing && existing.qty > 0 && existing.side !== side) {
    return {
      ok: false,
      error:
        "You already have the opposite side on this board. Close it first.",
    };
  }

  if (state.balanceCents < costCents) {
    return {
      ok: false,
      error: `Not enough paper cash (need ${(costCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}).`,
    };
  }

  let next: PaperPosition;
  if (!existing || existing.qty <= 0) {
    next = { side, qty, avgEntryCents: price };
  } else {
    const totalQty = existing.qty + qty;
    const avg =
      (existing.qty * existing.avgEntryCents + qty * price) / totalQty;
    next = {
      side,
      qty: totalQty,
      avgEntryCents: Math.round(avg * 100) / 100,
    };
  }

  await ensureMongoIndexes();
  const now = new Date();
  const [accountsCol, positionsCol, tradesCol] = await Promise.all([
    getPaperAccountsCollection(),
    getPositionsCollection(),
    getTradesCollection(),
  ]);

  await accountsCol.updateOne(
    { userId },
    {
      $set: {
        balanceCents: state.balanceCents - costCents,
        updatedAt: now,
      },
      $setOnInsert: {
        userId,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await positionsCol.updateOne(
    { userId, boardId },
    {
      $set: {
        side: next.side,
        qty: next.qty,
        avgEntryCents: next.avgEntryCents,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await tradesCol.insertOne({
    userId,
    boardId,
    side: side as TradeSide,
    qty,
    priceCents: price,
    createdAt: now,
  });

  const market = await updateBoardMarket(boardId, side as TradeSide, qty, true);
  if (market) {
    await publishBoardUpdated({
      ...market,
      at: new Date().toISOString(),
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/boards");
  revalidatePath("/dashboard/positions");
  revalidatePath(`/dashboard/boards/${boardId}`);

  const { yes, no } = yesNoPrices(board);
  const label = side === "yes" ? `Yes @ ${yes}¢` : `No @ ${no}¢`;
  return {
    ok: true,
    message: `Bought ${qty} ${label} (paper).`,
  };
}

export async function sellPaper(
  _prev: PaperTradeResult | null,
  formData: FormData,
): Promise<PaperTradeResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Sign in to trade." };

  const boardId = String(formData.get("boardId") ?? "");

  const board = await requireCampusBoard(boardId);
  if (!board) return { ok: false, error: "Board not available." };

  const state = await getPaperState(userId);

  const existing = state.positions[boardId];
  if (!existing || existing.qty <= 0) {
    return { ok: false, error: "No open position on this board." };
  }

  const price = markPriceCents(board, existing.side);
  const proceedsCents = existing.qty * price;

  await ensureMongoIndexes();
  const now = new Date();
  const [accountsCol, positionsCol, tradesCol] = await Promise.all([
    getPaperAccountsCollection(),
    getPositionsCollection(),
    getTradesCollection(),
  ]);

  await accountsCol.updateOne(
    { userId },
    {
      $set: {
        balanceCents: state.balanceCents + proceedsCents,
        updatedAt: now,
      },
      $setOnInsert: {
        userId,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await positionsCol.deleteOne({ userId, boardId });

  await tradesCol.insertOne({
    userId,
    boardId,
    side: existing.side as TradeSide,
    qty: -existing.qty,
    priceCents: price,
    createdAt: now,
  });

  const market = await updateBoardMarket(
    boardId,
    existing.side as TradeSide,
    existing.qty,
    false,
  );
  if (market) {
    await publishBoardUpdated({
      ...market,
      at: new Date().toISOString(),
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/boards");
  revalidatePath("/dashboard/positions");
  revalidatePath(`/dashboard/boards/${boardId}`);

  return {
    ok: true,
    message: `Sold ${existing.qty} contracts at consensus (paper).`,
  };
}
