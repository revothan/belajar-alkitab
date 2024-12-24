import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LMSLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function LMSLayout({ children, className }: LMSLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Navbar />
        <main className={cn("flex-1 overflow-hidden", className)}>
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

