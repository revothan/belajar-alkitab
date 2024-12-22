import { FileText, BookOpen, Scroll, Book, Download, User } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Button variant="ghost" className="gap-2">
            <FileText className="h-4 w-4" />
            My Notes
          </Button>
          <Button variant="ghost" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Teacher Note
          </Button>
          <Button variant="ghost" className="gap-2">
            <Scroll className="h-4 w-4" />
            Transcript
          </Button>
          <Button variant="ghost" className="gap-2">
            <Book className="h-4 w-4" />
            Reflection
          </Button>
          <Button variant="ghost" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="ghost" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>
    </nav>
  );
}