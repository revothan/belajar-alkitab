import { FileText, BookOpen, Scroll, Book, Download, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Navbar() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    try {
      // First check if we actually have a session
      if (!session) {
        navigate('/');
        toast.success("Already logged out");
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If it's a user_not_found error or the session is invalid, 
        // we can safely proceed with navigation
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
      // Even if there's an error, we should still redirect the user
      navigate('/');
      toast.error("Error during logout, but you've been redirected to home");
    }
  };

  return (
    <nav className="w-full border-b bg-background">
      <div className="container flex h-12 items-center px-2 justify-between">
        <div>
          {/* You can add a logo or site name here if desired */}
        </div>
        <div className="flex gap-2 md:gap-4 overflow-x-auto">
          {session ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 h-8"
                onClick={() => navigate('/my-notes')}
              >
                <FileText className="h-3 w-3" />
                <span className="text-xs">My Notes</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <BookOpen className="h-3 w-3" />
                <span className="text-xs">Teacher Note</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <Scroll className="h-3 w-3" />
                <span className="text-xs">Transcript</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <Book className="h-3 w-3" />
                <span className="text-xs">Reflection</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <Download className="h-3 w-3" />
                <span className="text-xs">Download</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <User className="h-3 w-3" />
                <span className="text-xs">Profile</span>
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-1.5 h-8"
                onClick={handleLogout}
              >
                <LogOut className="h-3 w-3" />
                <span className="text-xs">Logout</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1.5 h-8"
              onClick={() => navigate('/login')}
            >
              <User className="h-3 w-3" />
              <span className="text-xs">Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}