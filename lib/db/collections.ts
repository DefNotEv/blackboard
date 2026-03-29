import "server-only";

import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type {
  BoardDoc,
  PaperAccountDoc,
  PositionDoc,
  TradeDoc,
} from "@/lib/db/types";

const COLLECTIONS = {
  boards: "boards",
  trades: "trades",
  positions: "positions",
  paperAccounts: "paper_accounts",
} as const;

let indexesEnsured = false;

export async function getBoardsCollection(): Promise<Collection<BoardDoc>> {
  const db = await getDb();
  return db.collection<BoardDoc>(COLLECTIONS.boards);
}

export async function getTradesCollection(): Promise<Collection<TradeDoc>> {
  const db = await getDb();
  return db.collection<TradeDoc>(COLLECTIONS.trades);
}

export async function getPositionsCollection(): Promise<Collection<PositionDoc>> {
  const db = await getDb();
  return db.collection<PositionDoc>(COLLECTIONS.positions);
}

export async function getPaperAccountsCollection(): Promise<
  Collection<PaperAccountDoc>
> {
  const db = await getDb();
  return db.collection<PaperAccountDoc>(COLLECTIONS.paperAccounts);
}

export async function ensureMongoIndexes(): Promise<void> {
  if (indexesEnsured) return;

  const [boards, trades, positions, paperAccounts] = await Promise.all([
    getBoardsCollection(),
    getTradesCollection(),
    getPositionsCollection(),
    getPaperAccountsCollection(),
  ]);

  await Promise.all([
    boards.createIndexes([
      { key: { id: 1 }, name: "boards_id_unique", unique: true },
      { key: { schoolId: 1 }, name: "boards_school_id" },
      { key: { updatedAt: -1 }, name: "boards_updated_at_desc" },
    ]),
    trades.createIndexes([
      { key: { boardId: 1, createdAt: -1 }, name: "trades_board_created_desc" },
      { key: { userId: 1, createdAt: -1 }, name: "trades_user_created_desc" },
    ]),
    positions.createIndexes([
      {
        key: { userId: 1, boardId: 1 },
        name: "positions_user_board_unique",
        unique: true,
      },
      { key: { boardId: 1, updatedAt: -1 }, name: "positions_board_updated_desc" },
    ]),
    paperAccounts.createIndexes([
      {
        key: { userId: 1 },
        name: "paper_accounts_user_unique",
        unique: true,
      },
    ]),
  ]);

  indexesEnsured = true;
}
