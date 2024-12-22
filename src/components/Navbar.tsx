import React, { useState } from "react";
import { FileText, BookOpen, Scroll, Book, Download, User, LogOut, GraduationCap, School, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
        navigate('/');
        toast.success("Already logged out");
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message.includes('user_not_found') || 
            error.message.includes('invalid_jwt')) {
          navigate('/');
          toast.success("Logged out successfully");
          return;
        }
        throw error;
      }

      toast.success("Logged out successfully");
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/');
      toast.error("Error during logout, but you've been redirected to home");
    }
  };

  const getNavButtons = () => {
    if (!session) {
      return [{
        icon: User,
        label: "Login",
        onClick: () => {
          navigate('/login');
          setIsOpen(false);
        },
        variant: "default"
      }];
    }

    const commonButtons = [
      {
        icon: LogOut,
        label: "Logout",
        onClick: handleLogout,
        variant: "destructive"
      }
    ];

    const isTeacher = profile?.role === 'teacher';
    if (isTeacher) {
      commonButtons.unshift({
        icon: School,
        label: "Teacher Panel",
        onClick: () => {
          navigate('/teacher-dashboard');
          setIsOpen(false);
        },
        variant: "ghost"
      });
    }

    if (location.pathname.includes('/learning-dashboard')) {
      return [
        {
          icon: GraduationCap,
          label: "Learning",
          onClick: () => {
            navigate('/modules');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        {
          icon: FileText,
          label: "My Notes",
          onClick: () => {
            navigate('/my-notes');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        {
          icon: BookOpen,
          label: "Teacher Note",
          onClick: () => {
            navigate('/teacher-note');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        {
          icon: Scroll,
          label: "Transcript",
          onClick: () => {
            navigate('/transcript');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        {
          icon: Book,
          label: "Reflection",
          onClick: () => {
            navigate('/reflection');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        {
          icon: Download,
          label: "Download",
          onClick: () => {/* handle download */},
          variant: "ghost"
        },
        ...commonButtons
      ];
    }

    if (location.pathname.includes('/modules') || 
        location.pathname.includes('/my-notes') || 
        location.pathname.includes('/teacher-dashboard')) {
      return [
        {
          icon: GraduationCap,
          label: "Learning",
          onClick: () => {
            navigate('/modules');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        {
          icon: FileText,
          label: "My Notes",
          onClick: () => {
            navigate('/my-notes');
            setIsOpen(false);
          },
          variant: "ghost"
        },
        ...commonButtons
      ];
    }

    return commonButtons;
  };

  const navButtons = getNavButtons();

  return (
    <nav className="w-full border-b bg-background">
      <div className="container flex h-12 items-center px-2 justify-between">
        <div>
          {/* Logo space */}
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          {navButtons.map((button, index) => (
            <Button 
              key={index}
              variant={button.variant} 
              size="sm" 
              className="gap-1.5 h-8"
              onClick={button.onClick}
            >
              <button.icon className="h-3 w-3" />
              <span className="text-xs">{button.label}</span>
            </Button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-2 pt-6">
                {navButtons.map((button, index) => (
                  <Button 
                    key={index}
                    variant={button.variant} 
                    size="sm" 
                    className="w-full justify-start gap-2"
                    onClick={button.onClick}
                  >
                    <button.icon className="h-4 w-4" />
                    <span>{button.label}</span>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;