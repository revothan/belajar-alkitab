import { SidebarProvider } from "@/components/ui/sidebar";
import { LMSSidebar } from "./LMSSidebar";
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
        <main className={cn("flex-1 overflow-hidden", className)}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}