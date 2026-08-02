"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS, DASHBOARD_SETTINGS_ITEM, isNavItemActive } from "./nav-items";

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4.5" />
      {label}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} active={isNavItemActive(item.href, pathname)} />
        ))}
      </nav>
      <div className="border-t border-border/60 p-3">
        <NavLink
          {...DASHBOARD_SETTINGS_ITEM}
          active={isNavItemActive(DASHBOARD_SETTINGS_ITEM.href, pathname)}
        />
      </div>
    </aside>
  );
}
