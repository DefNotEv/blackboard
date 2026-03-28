import Link from "next/link";
import { HomeAuth } from "@/components/home-auth";

export default function Home() {
  return (
    <div className="bb-grain flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
      <main className="flex w-full max-w-lg flex-col items-center gap-10 text-center">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-bb-muted">
            Campus-scoped
          </p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-bb-chalk sm:text-6xl">
            Blackboard
          </h1>
          <p className="text-pretty text-base leading-relaxed text-bb-dim">
            Trade on boards for your school—sign in, pick your campus, and open
            the dashboard.{" "}
            <Link
              href="/dashboard"
              className="font-semibold text-bb-chalk underline decoration-bb-border underline-offset-4 transition hover:decoration-bb-chalk"
            >
              /dashboard
            </Link>
          </p>
        </div>

        <HomeAuth />
      </main>
    </div>
  );
}
