import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UniversityForm } from "@/components/onboarding/university-form";
import { getUserSchool } from "@/lib/user-school";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  if (getUserSchool(user)) {
    redirect("/dashboard");
  }

  return (
    <div className="bb-grain flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-bb-muted">
            Blackboard
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-bb-chalk">
            Your campus
          </h1>
          <p className="text-pretty text-bb-dim">
            Pick your school so we only show boards for your university.
          </p>
        </div>
        <UniversityForm />
        <p className="text-xs text-bb-muted">
          <Link
            href="/"
            className="font-semibold text-bb-dim underline underline-offset-4 hover:text-bb-chalk"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
