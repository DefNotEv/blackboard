import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard#boards", label: "Boards" },
  { href: "/dashboard#positions", label: "Positions" },
] as const;

export function DashboardSidebar({
  universityName,
}: {
  universityName: string;
}) {
  return (
    <aside className="flex w-full flex-col border-b border-bb-border bg-bb-surface/90 backdrop-blur lg:fixed lg:inset-y-0 lg:w-56 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:flex-col lg:items-stretch lg:px-5 lg:py-8">
        <div className="lg:w-full">
          <Link
            href="/"
            className="font-display text-lg font-extrabold tracking-tight text-bb-chalk"
          >
            Blackboard
          </Link>
          <p
            className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-bb-muted"
            title={universityName}
          >
            {universityName}
          </p>
        </div>
        <nav className="flex gap-1 lg:flex-col lg:gap-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-bb-dim transition hover:bg-bb-raised hover:text-bb-chalk"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
