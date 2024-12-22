import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimestampManager } from "./TimestampManager";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateSessionForm } from "./UpdateSessionForm";

interface Session {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  slides_url: string | null;
  teacher_notes: string | null;
  reflection_questions: string[] | null;
}

interface SessionCardProps {
  session: Session;
  index: number;
  onUpdate: () => void;
  onDelete: () => void;
}

export const SessionCard = ({ session, index, onUpdate, onDelete }: SessionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSessionDelete = async () => {
    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", session.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session deleted successfully",
      });

      onDelete();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  return (
    <Card key={session.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {index + 1}. {session.title}
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Session</DialogTitle>
                </DialogHeader>
                <UpdateSessionForm
                  session={session}
                  onSuccess={() => {
                    setIsEditing(false);
                    onUpdate();
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleSessionDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {session.thumbnail_url && (
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="w-32 h-32 object-cover rounded"
            />
          )}
          <p className="text-sm text-muted-foreground">
            {session.description}
          </p>
          {session.youtube_url && (
            <p className="text-sm">
              YouTube: <a href={session.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{session.youtube_url}</a>
            </p>
          )}
          {session.slides_url && (
            <p className="text-sm">
              Slides: <a href={session.slides_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{session.slides_url}</a>
            </p>
          )}
          {session.teacher_notes && (
            <div>
              <h4 className="font-medium text-sm">Teacher's Notes:</h4>
              <p className="text-sm">{session.teacher_notes}</p>
            </div>
          )}
          {session.reflection_questions && (
            <div>
              <h4 className="font-medium text-sm">Reflection Questions:</h4>
              <ul className="list-disc list-inside text-sm">
                {session.reflection_questions.map((question, i) => (
                  <li key={i}>{question}</li>
                ))}
              </ul>
            </div>
          )}
          
          {session.youtube_url && (
            <TimestampManager sessionId={session.id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};