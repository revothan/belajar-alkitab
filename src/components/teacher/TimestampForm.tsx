import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TimestampFormProps {
  sessionId: string;
  onSuccess: () => void;
}

export function TimestampForm({ sessionId, onSuccess }: TimestampFormProps) {
  const [timestamp, setTimestamp] = useState("");
  const [slideImage, setSlideImage] = useState<File | null>(null);
  const { toast } = useToast();

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
      onSuccess();
    } catch (error) {
      console.error("Error adding timestamp:", error);
      toast({
        title: "Error",
        description: "Failed to add timestamp",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Time (mm:ss)"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        pattern="\d{1,2}:\d{2}"
        title="Format: mm:ss (e.g., 1:30)"
        className="w-full md:w-auto"
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setSlideImage(e.target.files[0])}
        className="cursor-pointer w-full md:w-auto"
      />
      <Button onClick={handleAddTimestamp} className="w-full md:w-auto">
        Add Timestamp
      </Button>
    </div>
  );
}