import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { getUserSchool } from "@/lib/user-school";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const school = getUserSchool(user);
  if (!school) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-full flex-col bg-bb-bg lg:flex-row">
      <DashboardSidebar universityName={school.universityName} />
      <div className="flex min-h-full flex-1 flex-col lg:pl-56">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-bb-border bg-bb-bg/90 px-4 py-3 backdrop-blur lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold text-bb-dim transition hover:text-bb-chalk"
          >
            ← Home
          </Link>
          <UserMenu />
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
