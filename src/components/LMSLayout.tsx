import { SidebarProvider } from "@/components/ui/sidebar";
import { LMSSidebar } from "./LMSSidebar";
import { NavBar } from "./NavBar";
import { cn } from "@/lib/utils";

interface LMSLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function LMSLayout({ children, className }: LMSLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <LMSSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavBar />
          <main className={cn("flex-1 overflow-auto", className)}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}