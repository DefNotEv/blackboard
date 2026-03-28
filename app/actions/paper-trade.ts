"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { PaperPosition, PaperSide, PaperState } from "@/lib/paper-trading";
import {
  defaultPaperState,
  markPriceCents,
  PAPER_COOKIE,
  yesNoPrices,
} from "@/lib/paper-trading";
import { getPaperState } from "@/lib/paper-trading-state";
import { getBoardById } from "@/lib/mock-boards";
import { getUserSchool } from "@/lib/user-school";

export type PaperTradeResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

async function requireCampusBoard(boardId: string) {
  const user = await currentUser();
  const school = getUserSchool(user);
  const board = getBoardById(boardId);
  if (!board || !school || board.schoolId !== school.universityId) {
    return null;
  }
  return board;
}

async function saveState(state: PaperState) {
  const store = await cookies();
  store.set(PAPER_COOKIE, JSON.stringify(state), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
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

  let state = await getPaperState(userId);
  if (state.userId !== userId) state = defaultPaperState(userId);

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

  const newState: PaperState = {
    ...state,
    balanceCents: state.balanceCents - costCents,
    positions: { ...state.positions, [boardId]: next },
  };

  await saveState(newState);
  revalidatePath("/dashboard");
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

  let state = await getPaperState(userId);
  if (state.userId !== userId) state = defaultPaperState(userId);

  const existing = state.positions[boardId];
  if (!existing || existing.qty <= 0) {
    return { ok: false, error: "No open position on this board." };
  }

  const price = markPriceCents(board, existing.side);
  const proceedsCents = existing.qty * price;

  const positions = { ...state.positions };
  delete positions[boardId];

  const newState: PaperState = {
    ...state,
    balanceCents: state.balanceCents + proceedsCents,
    positions,
  };

  await saveState(newState);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/boards/${boardId}`);

  return {
    ok: true,
    message: `Sold ${existing.qty} contracts at consensus (paper).`,
  };
}
