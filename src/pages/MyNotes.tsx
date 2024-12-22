import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LMSLayout } from "@/components/LMSLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const MyNotes = () => {
  const { data: notes, isLoading } = useQuery({
    queryKey: ["my-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_notes")
        .select(`
          *,
          module:modules(title),
          session:sessions(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes?.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.module?.title}</TableCell>
                  <TableCell>{note.session?.title}</TableCell>
                  <TableCell className="max-w-md truncate">{note.content}</TableCell>
                  <TableCell>{format(new Date(note.created_at), 'PPp')}</TableCell>
                </TableRow>
              ))}
              {notes?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No notes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </LMSLayout>
  );
};

export default MyNotes;