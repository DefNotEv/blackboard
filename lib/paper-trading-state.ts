import "server-only";

import { cookies } from "next/headers";
import {
  defaultPaperState,
  PAPER_COOKIE,
  type PaperState,
} from "@/lib/paper-trading";

function parseState(raw: string | undefined, userId: string): PaperState {
  if (!raw) return defaultPaperState(userId);
  try {
    const parsed = JSON.parse(raw) as Partial<PaperState>;
    if (parsed.userId !== userId || typeof parsed.balanceCents !== "number") {
      return defaultPaperState(userId);
    }
    return {
      userId,
      balanceCents: Math.max(0, Math.floor(parsed.balanceCents)),
      positions:
        parsed.positions && typeof parsed.positions === "object"
          ? parsed.positions
          : {},
    };
  } catch {
    return defaultPaperState(userId);
  }
}

export async function getPaperState(userId: string): Promise<PaperState> {
  const store = await cookies();
  return parseState(store.get(PAPER_COOKIE)?.value, userId);
}
