import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NotesEditorProps {
  className?: string;
}

export function NotesEditor({ className }: NotesEditorProps) {
  const [notes, setNotes] = useState("");

  // Simulated auto-save functionality
  useEffect(() => {
    const saveNotes = setTimeout(() => {
      console.log("Saving notes:", notes);
      // Here you would typically save to a backend
    }, 1000);

    return () => clearTimeout(saveNotes);
  }, [notes]);

  return (
    <div className={cn("rounded-lg bg-white shadow-lg p-4", className)}>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-full min-h-[200px] resize-none border-none focus:outline-none bg-transparent"
      />
    </div>
  );
}