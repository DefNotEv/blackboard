import "server-only";

import { getAllBoardsFromStore } from "@/lib/boards-store";
import type { OpenPositionRow, PaperState } from "@/lib/paper-trading";
import { unrealizedPnlCents } from "@/lib/paper-trading";

export async function listOpenPositions(
  state: PaperState,
): Promise<OpenPositionRow[]> {
  const boards = await getAllBoardsFromStore();
  const byId = new Map(boards.map((board) => [board.id, board]));
  const rows: OpenPositionRow[] = [];
  for (const [boardId, position] of Object.entries(state.positions)) {
    if (position.qty <= 0) continue;
    const board = byId.get(boardId);
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

export async function totalUnrealizedCents(state: PaperState): Promise<number> {
  const rows = await listOpenPositions(state);
  return rows.reduce((sum, row) => sum + row.unrealizedCents, 0);
}
