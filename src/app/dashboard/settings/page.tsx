"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Laptop, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Card className="gap-4 p-6">
        <CardHeader className="p-0">
          <h2 className="font-heading text-base font-semibold">Account</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5 p-0">
          <Label className="text-xs text-muted-foreground">Email</Label>
          <p className="text-sm font-medium">{user?.email}</p>
        </CardContent>
      </Card>

      <Card className="gap-4 p-6">
        <CardHeader className="p-0">
          <h2 className="font-heading text-base font-semibold">Appearance</h2>
        </CardHeader>
        <CardContent className="flex gap-2 p-0">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-xl border border-border/60 py-4 text-sm font-medium transition-colors hover:bg-muted/50",
                theme === option.value && "border-brand bg-brand/5 text-brand",
              )}
            >
              <option.icon className="size-4" />
              {option.label}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-4 p-6">
        <CardHeader className="p-0">
          <h2 className="font-heading text-base font-semibold">Session</h2>
        </CardHeader>
        <CardContent className="p-0">
          <Button variant="outline" className="gap-2" onClick={handleLogout}>
            <LogOut className="size-4" /> Log out
          </Button>
        </CardContent>
      </Card>

      <Card className="gap-4 border-destructive/30 p-6">
        <CardHeader className="p-0">
          <h2 className="font-heading text-base font-semibold text-destructive">Danger zone</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-0">
          <p className="text-sm text-muted-foreground">
            Self-serve account deletion isn&rsquo;t available yet. To delete your account and all
            associated data, contact{" "}
            <a href="mailto:support@videoloom.example" className="underline hover:text-foreground">
              support@videoloom.example
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
