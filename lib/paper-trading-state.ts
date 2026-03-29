import "server-only";

import {
  defaultPaperState,
  PAPER_STARTING_BALANCE_CENTS,
  type PaperPosition,
  type PaperState,
} from "@/lib/paper-trading";
import {
  ensureMongoIndexes,
  getPaperAccountsCollection,
  getPositionsCollection,
} from "@/lib/db";

export async function getPaperState(userId: string): Promise<PaperState> {
  try {
    await ensureMongoIndexes();

    const [accountsCol, positionsCol] = await Promise.all([
      getPaperAccountsCollection(),
      getPositionsCollection(),
    ]);

    const account = await accountsCol.findOne({ userId });
    if (!account) {
      const now = new Date();
      await accountsCol.updateOne(
        { userId },
        {
          $setOnInsert: {
            userId,
            balanceCents: PAPER_STARTING_BALANCE_CENTS,
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true },
      );
    }

    const docs = await positionsCol.find({ userId }).toArray();
    const positions: Record<string, PaperPosition> = {};
    for (const doc of docs) {
      if (doc.qty <= 0) continue;
      positions[doc.boardId] = {
        side: doc.side,
        qty: doc.qty,
        avgEntryCents: doc.avgEntryCents,
      };
    }

    return {
      ...defaultPaperState(userId),
      balanceCents: account?.balanceCents ?? PAPER_STARTING_BALANCE_CENTS,
      positions,
    };
  } catch {
    // Allow dashboard to render even if Mongo is unavailable in deployment.
    return defaultPaperState(userId);
  }
}
