"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { getUniversityById, UNIVERSITIES } from "@/lib/universities";

export function UniversityForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [universityId, setUniversityId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) return;
    const uni = getUniversityById(universityId);
    if (!uni) {
      setError("Choose a university.");
      return;
    }
    setPending(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          universityId: uni.id,
          universityName: uni.name,
        },
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not save. Try again.");
      setPending(false);
    }
  }

  if (!isLoaded) {
    return (
      <p className="text-center text-sm text-bb-muted">Loading…</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6 text-left">
      <div className="space-y-2">
        <label
          htmlFor="university"
          className="block text-sm font-bold text-bb-chalk"
        >
          Which university do you attend?
        </label>
        <p className="text-sm text-bb-dim">
          Boards and trades are scoped to your campus—you only see activity for
          your school.
        </p>
        <select
          id="university"
          required
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-bb-border bg-bb-surface px-4 py-3 text-sm font-medium text-bb-chalk shadow-sm outline-none transition focus:border-bb-dim focus:ring-2 focus:ring-bb-border"
        >
          <option value="">Select your university…</option>
          {UNIVERSITIES.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p className="text-sm font-semibold text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl border border-bb-border bg-bb-chalk px-4 py-3 text-sm font-bold tracking-tight text-bb-bg transition hover:bg-bb-chalk/90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
