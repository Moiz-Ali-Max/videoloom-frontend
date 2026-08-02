"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { LinkButton } from "@/components/shared/link-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function MarketingNavbar() {
  const { status } = useAuth();
  const isAuthed = status === "authenticated";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthed ? (
            <LinkButton href="/dashboard">Dashboard</LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost">
                Log in
              </LinkButton>
              <LinkButton href="/signup">Get started free</LinkButton>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">
                <Logo />
              </SheetTitle>
              <div className="flex flex-col gap-6 px-4">
                <nav className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-base font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2">
                  {isAuthed ? (
                    <LinkButton href="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </LinkButton>
                  ) : (
                    <>
                      <LinkButton href="/login" variant="outline" onClick={() => setOpen(false)}>
                        Log in
                      </LinkButton>
                      <LinkButton href="/signup" onClick={() => setOpen(false)}>
                        Get started free
                      </LinkButton>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
