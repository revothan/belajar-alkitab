import { FileText, BookOpen, Scroll, Book, Download, User } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b bg-background">
      <div className="container flex h-12 items-center px-2 justify-end">
        <div className="flex gap-2 md:gap-4 overflow-x-auto">
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
        </div>
      </div>
    </nav>
  );
}