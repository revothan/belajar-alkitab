import React, { useState } from "react";
import {
  FileText,
  BookOpen,
  Scroll,
  Book,
  Download,
  User,
  LogOut,
  GraduationCap,
  School,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavButton = {
  icon: React.ElementType;
  label: string;
  onClick: () => Promise<void>;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleLogout = async () => {
    try {
      if (!session) {
        navigate("/");
        toast.success("Already logged out");
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        if (
          error.message.includes("user_not_found") ||
          error.message.includes("invalid_jwt")
        ) {
          navigate("/");
          toast.success("Logged out successfully");
          return;
        }
        throw error;
      }

      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
      toast.error("Error during logout, but you've been redirected to home");
    }
  };

  const getNavButtons = (): NavButton[] => {
    if (!session) {
      return [
        {
          icon: User,
          label: "Login",
          onClick: async () => {
            navigate("/login");
            setIsOpen(false);
          },
          variant: "default",
        },
      ];
    }

    const commonButtons: NavButton[] = [
      {
        icon: LogOut,
        label: "Logout",
        onClick: handleLogout,
        variant: "destructive",
      },
    ];

    const isTeacher = profile?.role === "teacher";
    if (isTeacher) {
      commonButtons.unshift({
        icon: School,
        label: "Teacher Panel",
        onClick: async () => {
          navigate("/teacher-dashboard");
          setIsOpen(false);
        },
        variant: "ghost",
      });
    }

    if (location.pathname.includes("/learning-dashboard")) {
      return [
        {
          icon: GraduationCap,
          label: "Learning",
          onClick: async () => {
            navigate("/modules");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        {
          icon: FileText,
          label: "My Notes",
          onClick: async () => {
            navigate("/my-notes");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        {
          icon: BookOpen,
          label: "Teacher Note",
          onClick: async () => {
            navigate("/teacher-note");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        {
          icon: Scroll,
          label: "Transcript",
          onClick: async () => {
            navigate("/transcript");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        {
          icon: Book,
          label: "Reflection",
          onClick: async () => {
            navigate("/reflection");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        {
          icon: Download,
          label: "Download",
          onClick: async () => {
            /* handle download */
          },
          variant: "ghost",
        },
        ...commonButtons,
      ];
    }

    if (
      location.pathname.includes("/modules") ||
      location.pathname.includes("/my-notes") ||
      location.pathname.includes("/teacher-dashboard")
    ) {
      return [
        {
          icon: GraduationCap,
          label: "Learning",
          onClick: async () => {
            navigate("/modules");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        {
          icon: FileText,
          label: "My Notes",
          onClick: async () => {
            navigate("/my-notes");
            setIsOpen(false);
          },
          variant: "ghost",
        },
        ...commonButtons,
      ];
    }

    return commonButtons;
  };

  const navButtons = getNavButtons();
  const isActive = (label: string) =>
    location.pathname.includes(label.toLowerCase());

  return (
    <nav className="w-full border-b bg-background sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo - Replace with your actual logo */}
          <div className="font-bold text-xl">Belajar Alkitab</div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navButtons.map((button, index) => {
            const active = isActive(button.label);
            return (
              <Button
                key={index}
                variant={active ? "default" : button.variant}
                size="sm"
                className={cn(
                  "gap-2 h-9 px-4 transition-all duration-200",
                  active
                    ? "bg-black text-white hover:bg-gray-800"
                    : "hover:bg-gray-100",
                  button.variant === "destructive" && "hover:bg-red-600",
                  "group relative overflow-hidden",
                )}
                onClick={button.onClick}
              >
                <button.icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    active && "text-white",
                  )}
                />
                <span className="text-sm font-medium">{button.label}</span>
                {active && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col p-6">
                <h2 className="text-lg font-semibold mb-6">Menu</h2>
                <div className="flex flex-col gap-2">
                  {navButtons.map((button, index) => {
                    const active = isActive(button.label);
                    return (
                      <Button
                        key={index}
                        variant={active ? "default" : button.variant}
                        size="lg"
                        className={cn(
                          "w-full justify-start gap-3 relative group",
                          active
                            ? "bg-black text-white hover:bg-gray-800"
                            : "hover:bg-gray-100",
                          button.variant === "destructive" &&
                            "hover:bg-red-600",
                        )}
                        onClick={button.onClick}
                      >
                        <button.icon
                          className={cn(
                            "h-5 w-5 transition-transform group-hover:scale-110",
                            active && "text-white",
                          )}
                        />
                        <span className="flex-1">{button.label}</span>
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 opacity-0 -translate-x-2 transition-all",
                            "group-hover:opacity-100 group-hover:translate-x-0",
                          )}
                        />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

