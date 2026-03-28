"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export function HomeAuth() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Show when="signed-out">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-xl border border-bb-border bg-bb-chalk px-8 py-3 text-sm font-bold tracking-tight text-bb-bg transition hover:bg-bb-chalk/90"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              fallbackRedirectUrl="/onboarding"
              forceRedirectUrl="/onboarding"
            >
              <button
                type="button"
                className="rounded-xl border border-bb-border bg-transparent px-8 py-3 text-sm font-bold tracking-tight text-bb-chalk transition hover:bg-bb-raised"
              >
                Sign up
              </button>
            </SignUpButton>
          </div>
        </Show>
        <Show when="signed-in">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <UserButton
              appearance={{
                elements: { avatarBox: "h-10 w-10 ring-2 ring-bb-border" },
              }}
            />
            <Link
              href="/dashboard"
              className="rounded-xl border border-bb-border bg-bb-chalk px-8 py-3 text-sm font-bold tracking-tight text-bb-bg transition hover:bg-bb-chalk/90"
            >
              Open dashboard
            </Link>
          </div>
        </Show>
      </div>

      <p className="text-xs text-bb-muted">
        Full-page auth:{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-bb-dim underline underline-offset-4 hover:text-bb-chalk"
        >
          /sign-in
        </Link>
        ,{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-bb-dim underline underline-offset-4 hover:text-bb-chalk"
        >
          /sign-up
        </Link>
      </p>
    </>
  );
}
