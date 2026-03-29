import "server-only";

import type { BoardPreview } from "@/components/dashboard/board-card";
import { ensureMongoIndexes, getBoardsCollection } from "@/lib/db";
import { MOCK_BOARDS } from "@/lib/mock-boards";

type BoardDocShape = {
  id: string;
  schoolId: string;
  title: string;
  school: string;
  yesPct: number;
  volumeLabel: string;
  closesIn: string;
};

function toPreview(doc: BoardDocShape): BoardPreview {
  return {
    id: doc.id,
    schoolId: doc.schoolId,
    title: doc.title,
    school: doc.school,
    yesPct: doc.yesPct,
    volumeLabel: doc.volumeLabel,
    closesIn: doc.closesIn,
  };
}

export async function getAllBoardsFromStore(): Promise<BoardPreview[]> {
  try {
    await ensureMongoIndexes();
    const boards = await (await getBoardsCollection())
      .find(
        {},
        {
          projection: {
            _id: 0,
            id: 1,
            schoolId: 1,
            title: 1,
            school: 1,
            yesPct: 1,
            volumeLabel: 1,
            closesIn: 1,
          },
        },
      )
      .toArray();

    if (boards.length === 0) return [...MOCK_BOARDS];
    return boards.map(toPreview);
  } catch {
    return [...MOCK_BOARDS];
  }
}

export async function getBoardsForSchoolFromStore(
  schoolId: string,
): Promise<BoardPreview[]> {
  const boards = await getAllBoardsFromStore();
  return boards.filter((b) => b.schoolId === schoolId);
}

export async function getBoardByIdFromStore(
  id: string,
): Promise<BoardPreview | undefined> {
  try {
    await ensureMongoIndexes();
    const board = await (await getBoardsCollection()).findOne(
      { id },
      {
        projection: {
          _id: 0,
          id: 1,
          schoolId: 1,
          title: 1,
          school: 1,
          yesPct: 1,
          volumeLabel: 1,
          closesIn: 1,
        },
      },
    );
    if (board) return toPreview(board as BoardDocShape);
  } catch {
    // Fall through to mock fallback.
  }
  return MOCK_BOARDS.find((b) => b.id === id);
}
