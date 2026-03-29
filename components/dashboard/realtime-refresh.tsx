"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";

type BoardUpdatedEvent = {
  schoolId?: string;
};

export function RealtimeRefresh({ schoolId }: { schoolId: string }) {
  const router = useRouter();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) return;

    const pusher = new Pusher(key, { cluster });
    const channel = pusher.subscribe("boards");

    const handleUpdated = (payload: BoardUpdatedEvent) => {
      if (payload.schoolId && payload.schoolId !== schoolId) return;
      router.refresh();
    };

    channel.bind("board.updated", handleUpdated);

    return () => {
      channel.unbind("board.updated", handleUpdated);
      pusher.unsubscribe("boards");
      pusher.disconnect();
    };
  }, [router, schoolId]);

  return null;
}
