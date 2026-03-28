"use client";

import { UserButton } from "@clerk/nextjs";

export function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-9 w-9 ring-2 ring-bb-border",
        },
      }}
    />
  );
}
