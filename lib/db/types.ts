export type BoardDoc = {
  id: string;
  schoolId: string;
  title: string;
  school: string;
  yesPct: number;
  volumeLabel: string;
  closesIn: string;
  volumeCents?: number;
  closesAt?: Date;
  updatedAt: Date;
  createdAt: Date;
};

export type TradeSide = "yes" | "no";

export type TradeDoc = {
  userId: string;
  boardId: string;
  side: TradeSide;
  qty: number;
  priceCents: number;
  createdAt: Date;
};

export type PositionDoc = {
  userId: string;
  boardId: string;
  side: TradeSide;
  qty: number;
  avgEntryCents: number;
  updatedAt: Date;
  createdAt: Date;
};

export type PaperAccountDoc = {
  userId: string;
  balanceCents: number;
  updatedAt: Date;
  createdAt: Date;
};
