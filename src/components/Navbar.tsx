import { FileText, BookOpen, Scroll, Book, Download, User, LogOut, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

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
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/');
      toast.error("Error during logout, but you've been redirected to home");
    }
  };

  const renderNavButtons = () => {
    if (!session) {
      return (
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1.5 h-8"
          onClick={() => navigate('/login')}
        >
          <User className="h-3 w-3" />
          <span className="text-xs">Login</span>
        </Button>
      );
    }

    // Common buttons for all authenticated routes
    const commonButtons = [
      {
        icon: User,
        label: "Profile",
        onClick: () => navigate('/profile'),
        variant: "ghost"
      },
      {
        icon: LogOut,
        label: "Logout",
        onClick: handleLogout,
        variant: "destructive"
      }
    ];

    // Route-specific buttons
    if (location.pathname.includes('/learning-dashboard')) {
      return [
        {
          icon: GraduationCap,
          label: "Learning",
          onClick: () => navigate('/modules'),
          variant: "ghost"
        },
        {
          icon: FileText,
          label: "My Notes",
          onClick: () => navigate('/my-notes'),
          variant: "ghost"
        },
        {
          icon: BookOpen,
          label: "Teacher Note",
          onClick: () => navigate('/teacher-note'),
          variant: "ghost"
        },
        {
          icon: Scroll,
          label: "Transcript",
          onClick: () => navigate('/transcript'),
          variant: "ghost"
        },
        {
          icon: Book,
          label: "Reflection",
          onClick: () => navigate('/reflection'),
          variant: "ghost"
        },
        {
          icon: Download,
          label: "Download",
          onClick: () => {/* handle download */},
          variant: "ghost"
        },
        ...commonButtons
      ].map((button, index) => (
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
      ));
    }

    // Modules page buttons
    if (location.pathname.includes('/modules') || location.pathname.includes('/my-notes')) {
      return [
        {
          icon: GraduationCap,
          label: "Learning",
          onClick: () => navigate('/modules'),
          variant: "ghost"
        },
        {
          icon: FileText,
          label: "My Notes",
          onClick: () => navigate('/my-notes'),
          variant: "ghost"
        },
        ...commonButtons
      ].map((button, index) => (
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
      ));
    }

    // Default authenticated navigation
    return commonButtons.map((button, index) => (
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
    ));
  };

  return (
    <nav className="w-full border-b bg-background">
      <div className="container flex h-12 items-center px-2 justify-between">
        <div>
          {/* Logo space */}
        </div>
        <div className="flex gap-2 md:gap-4 overflow-x-auto">
          {renderNavButtons()}
        </div>
      </div>
    </nav>
  );
}