import type { BoardPreview } from "@/components/dashboard/board-card";
import { getBoardById } from "@/lib/mock-boards";

export const PAPER_COOKIE = "bb_paper_v1";
const DEFAULT_BALANCE_CENTS = 1_000_000; // $10,000 paper

export type PaperSide = "yes" | "no";

export type PaperPosition = {
  side: PaperSide;
  qty: number;
  avgEntryCents: number;
};

export type PaperState = {
  userId: string;
  balanceCents: number;
  /** One net position per board */
  positions: Record<string, PaperPosition>;
};

export function defaultPaperState(userId: string): PaperState {
  return {
    userId,
    balanceCents: DEFAULT_BALANCE_CENTS,
    positions: {},
  };
}

export function yesNoPrices(board: BoardPreview): { yes: number; no: number } {
  const yes = board.yesPct;
  return { yes, no: 100 - yes };
}

export function markPriceCents(board: BoardPreview, side: PaperSide): number {
  return side === "yes" ? board.yesPct : 100 - board.yesPct;
}

export function positionValueCents(
  pos: PaperPosition,
  board: BoardPreview,
): number {
  const m = markPriceCents(board, pos.side);
  return pos.qty * m;
}

export function unrealizedPnlCents(
  pos: PaperPosition,
  board: BoardPreview,
): number {
  const m = markPriceCents(board, pos.side);
  return pos.qty * (m - pos.avgEntryCents);
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export type OpenPositionRow = {
  boardId: string;
  board: BoardPreview;
  position: PaperPosition;
  unrealizedCents: number;
};

export function listOpenPositions(state: PaperState): OpenPositionRow[] {
  const rows: OpenPositionRow[] = [];
  for (const [boardId, position] of Object.entries(state.positions)) {
    if (position.qty <= 0) continue;
    const board = getBoardById(boardId);
    if (!board) continue;
    rows.push({
      boardId,
      board,
      position,
      unrealizedCents: unrealizedPnlCents(position, board),
    });
  }
  return rows;
}

export function totalUnrealizedCents(state: PaperState): number {
  return listOpenPositions(state).reduce((s, r) => s + r.unrealizedCents, 0);
}
