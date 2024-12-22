import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LMSLayout } from "@/components/LMSLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MyNotes = () => {
  const [editingNote, setEditingNote] = useState<any>(null);
  const [editedContent, setEditedContent] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["my-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_notes")
        .select(`
          *,
          module:modules(title),
          session:sessions(title),
          timestamp:session_timestamps(timestamp_seconds)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = (note: any) => {
    setEditingNote(note);
    setEditedContent(note.content);
  };

  const handleUpdate = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update notes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("session_notes")
        .update({ 
          content: editedContent,
          user_id: session.user.id 
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["my-notes"] });
      setEditingNote(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete notes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("session_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["my-notes"] });
      setNoteToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <LMSLayout>
        <div className="container py-6">
          <p className="text-center text-muted-foreground">Please log in to view your notes</p>
        </div>
      </LMSLayout>
    );
  }

  if (isLoading) {
    return (
      <LMSLayout>
        <div className="container py-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LMSLayout>
    );
  }

  return (
    <LMSLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">My Notes</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes?.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.module?.title}</TableCell>
                  <TableCell>{note.session?.title}</TableCell>
                  <TableCell>
                    {note.timestamp?.timestamp_seconds 
                      ? formatTimestamp(note.timestamp.timestamp_seconds)
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="max-w-md truncate">{note.content}</TableCell>
                  <TableCell>{format(new Date(note.created_at), 'PPp')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(note)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNoteToDelete(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {notes?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No notes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => noteToDelete && handleDelete(noteToDelete)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </LMSLayout>
  );
};

export default MyNotes;