import { DashboardSidebar } from "./sidebar";
import { DashboardTopbar } from "./topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
