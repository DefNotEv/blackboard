import Link from "next/link";
import { HomeAuth } from "@/components/home-auth";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Hackathon MVP
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Campus Markets
          </h1>
          <p className="text-pretty text-zinc-600 dark:text-zinc-400">
            Sign in to continue. Protected routes use Clerk middleware—try{" "}
            <Link
              href="/dashboard"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              /dashboard
            </Link>{" "}
            after you authenticate.
          </p>
        </div>

        <HomeAuth />
      </main>
    </div>
  );
}
