export {
  ensureMongoIndexes,
  getBoardsCollection,
  getPaperAccountsCollection,
  getPositionsCollection,
  getTradesCollection,
} from "@/lib/db/collections";
export type {
  BoardDoc,
  PaperAccountDoc,
  PositionDoc,
  TradeDoc,
  TradeSide,
} from "@/lib/db/types";
