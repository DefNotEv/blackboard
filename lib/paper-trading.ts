import type { BoardPreview } from "@/components/dashboard/board-card";

export const PAPER_COOKIE = "bb_paper_v1";
export const PAPER_STARTING_BALANCE_CENTS = 1_000_000; // $10,000 paper

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
    balanceCents: PAPER_STARTING_BALANCE_CENTS,
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
