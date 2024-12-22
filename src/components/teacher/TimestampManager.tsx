import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface TimestampManagerProps {
  sessionId: string;
}

interface Timestamp {
  id: string;
  timestamp_seconds: number;
  slide_url: string | null;
}

export function TimestampManager({ sessionId }: TimestampManagerProps) {
  const [timestamp, setTimestamp] = useState("");
  const [slideImage, setSlideImage] = useState<File | null>(null);
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

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `timestamps/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("module-content")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("module-content")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleAddTimestamp = async () => {
    try {
      let slideUrl = null;
      if (slideImage) {
        slideUrl = await handleImageUpload(slideImage);
      }

      // Convert timestamp string (mm:ss) to seconds
      const [minutes, seconds] = timestamp.split(":").map(Number);
      const timestampSeconds = minutes * 60 + seconds;

      const { error } = await supabase.from("session_timestamps").insert({
        session_id: sessionId,
        timestamp_seconds: timestampSeconds,
        slide_url: slideUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timestamp added successfully",
      });

      setTimestamp("");
      setSlideImage(null);
      refetchTimestamps();
    } catch (error) {
      console.error("Error adding timestamp:", error);
      toast({
        title: "Error",
        description: "Failed to add timestamp",
        variant: "destructive",
      });
    }
  };

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
      <div className="flex gap-4">
        <Input
          placeholder="Time (mm:ss)"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          pattern="\d{1,2}:\d{2}"
          title="Format: mm:ss (e.g., 1:30)"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setSlideImage(e.target.files[0])}
          className="cursor-pointer"
        />
        <Button onClick={handleAddTimestamp}>Add Timestamp</Button>
      </div>

      <div className="space-y-2">
        {timestamps?.map((ts) => (
          <div
            key={ts.id}
            className="flex items-center gap-4 p-2 border rounded-lg"
          >
            {editingId === ts.id ? (
              <>
                <Input
                  value={editTimestamp}
                  onChange={(e) => setEditTimestamp(e.target.value)}
                  pattern="\d{1,2}:\d{2}"
                  title="Format: mm:ss (e.g., 1:30)"
                  className="w-24"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleUpdateTimestamp(ts.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span>
                  {Math.floor(ts.timestamp_seconds / 60)}:
                  {(ts.timestamp_seconds % 60).toString().padStart(2, "0")}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEditing(ts)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteTimestamp(ts.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {ts.slide_url && (
              <img
                src={ts.slide_url}
                alt="Slide"
                className="w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}