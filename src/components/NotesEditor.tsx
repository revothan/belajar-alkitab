import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

interface NotesEditorProps {
  className?: string;
  currentTimestampId?: string | null;
}

export function NotesEditor({ className, currentTimestampId }: NotesEditorProps) {
  const [notes, setNotes] = useState("");
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const sessionId = searchParams.get('sessionId');
  const { toast } = useToast();

  const handleSubmitNotes = async () => {
    try {
      if (!moduleId || !sessionId || !notes.trim()) {
        toast({
          title: "Error",
          description: "Missing required information",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("session_notes").insert({
        module_id: moduleId,
        session_id: sessionId,
        timestamp_id: currentTimestampId,
        content: notes.trim(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notes saved successfully",
      });

      setNotes(""); // Clear the notes after successful submission
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("rounded-lg bg-white shadow-lg p-4 space-y-4", className)}>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full min-h-[200px] resize-none border-none focus:outline-none bg-transparent"
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmitNotes}
          disabled={!notes.trim()}
        >
          Save Notes
        </Button>
      </div>
    </div>
  );
}