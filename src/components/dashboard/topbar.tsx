"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS, DASHBOARD_SETTINGS_ITEM, isNavItemActive } from "./nav-items";
import { UserMenu } from "./user-menu";

const ALL_ITEMS = [...DASHBOARD_NAV_ITEMS, DASHBOARD_SETTINGS_ITEM];

export function DashboardTopbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = ALL_ITEMS.find((item) => isNavItemActive(item.href, pathname));

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetTitle className="px-4 pt-4">
            <Logo href="/dashboard" />
          </SheetTitle>
          <nav className="flex flex-col gap-1 p-3">
            {ALL_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <h1 className="flex-1 truncate text-sm font-semibold text-foreground md:text-base">
        {current?.label ?? "Dashboard"}
      </h1>

      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
