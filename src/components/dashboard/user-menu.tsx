"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-provider";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "VL";

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2" />}>
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
          {user?.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <div className="truncate px-1.5 pb-1.5 text-sm text-muted-foreground">{user?.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
