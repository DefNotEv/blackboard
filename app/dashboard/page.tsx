import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Signed in as{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {user?.primaryEmailAddress?.emailAddress ?? user?.id}
        </span>
        . This route is protected by Clerk middleware.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
      >
        ← Home
      </Link>
    </div>
  );
}
