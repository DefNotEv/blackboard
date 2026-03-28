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
                className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
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
                elements: { avatarBox: "h-10 w-10" },
              }}
            />
            <Link
              href="/dashboard"
              className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Open dashboard
            </Link>
          </div>
        </Show>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Full-page auth:{" "}
        <Link
          href="/sign-in"
          className="font-medium text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
        >
          /sign-in
        </Link>
        ,{" "}
        <Link
          href="/sign-up"
          className="font-medium text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
        >
          /sign-up
        </Link>
      </p>
    </>
  );
}
