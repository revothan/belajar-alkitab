import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TimestampForm } from "./TimestampForm";
import { TimestampItem } from "./TimestampItem";

interface TimestampManagerProps {
  sessionId: string;
}

interface Timestamp {
  id: string;
  timestamp_seconds: number;
  slide_url: string | null;
}

export function TimestampManager({ sessionId }: TimestampManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTimestamp, setEditTimestamp] = useState("");
  const { toast } = useToast();

  const { data: timestamps, refetch: refetchTimestamps } = useQuery({
    queryKey: ["timestamps", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_timestamps")
        .select("*")
        .eq("session_id", sessionId)
        .order("timestamp_seconds", { ascending: true });

      if (error) throw error;
      return data as Timestamp[];
    },
  });

  const handleUpdateTimestamp = async (id: string) => {
    try {
      const [minutes, seconds] = editTimestamp.split(":").map(Number);
      const timestampSeconds = minutes * 60 + seconds;

      const { error } = await supabase
        .from("session_timestamps")
        .update({ timestamp_seconds: timestampSeconds })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timestamp updated successfully",
      });

      setEditingId(null);
      setEditTimestamp("");
      refetchTimestamps();
    } catch (error) {
      console.error("Error updating timestamp:", error);
      toast({
        title: "Error",
        description: "Failed to update timestamp",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimestamp = async (id: string) => {
    try {
      const { error } = await supabase
        .from("session_timestamps")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timestamp deleted successfully",
      });

      refetchTimestamps();
    } catch (error) {
      console.error("Error deleting timestamp:", error);
      toast({
        title: "Error",
        description: "Failed to delete timestamp",
        variant: "destructive",
      });
    }
  };

  const startEditing = (timestamp: Timestamp) => {
    const minutes = Math.floor(timestamp.timestamp_seconds / 60);
    const seconds = timestamp.timestamp_seconds % 60;
    setEditTimestamp(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    setEditingId(timestamp.id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Manage Timestamps</h3>
      <TimestampForm sessionId={sessionId} onSuccess={refetchTimestamps} />
      <div className="space-y-2">
        {timestamps?.map((ts) => (
          <TimestampItem
            key={ts.id}
            timestamp={ts}
            isEditing={editingId === ts.id}
            editTimestamp={editTimestamp}
            onEdit={() => startEditing(ts)}
            onUpdate={() => handleUpdateTimestamp(ts.id)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDeleteTimestamp(ts.id)}
            onEditTimestampChange={setEditTimestamp}
          />
        ))}
      </div>
    </div>
  );
}