import "server-only";

import Pusher from "pusher";

let instance: Pusher | null | undefined;

function getPusher(): Pusher | null {
  if (instance !== undefined) return instance;

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    instance = null;
    return instance;
  }

  instance = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });
  return instance;
}

export type BoardUpdatedEvent = {
  boardId: string;
  schoolId: string;
  yesPct: number;
  volumeLabel: string;
  at: string;
};

export async function publishBoardUpdated(event: BoardUpdatedEvent) {
  const pusher = getPusher();
  if (!pusher) return;
  await pusher.trigger("boards", "board.updated", event);
}
