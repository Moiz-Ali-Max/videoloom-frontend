import {
  Captions,
  LayoutDashboard,
  Languages,
  ListVideo,
  MessageSquare,
  Scissors,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/transcriptions", label: "Transcriptions", icon: Captions },
  { href: "/dashboard/dubbing", label: "Dubbing", icon: Languages },
  { href: "/dashboard/clips", label: "Clips", icon: Scissors },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/playlists", label: "Playlists", icon: ListVideo },
];

export const DASHBOARD_SETTINGS_ITEM: DashboardNavItem = {
  href: "/dashboard/settings",
  label: "Settings",
  icon: Settings,
};

export function isNavItemActive(itemHref: string, pathname: string): boolean {
  return itemHref === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(itemHref);
}
