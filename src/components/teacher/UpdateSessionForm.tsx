import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface UpdateSessionFormProps {
  session: Session;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UpdateSessionForm = ({ session, onSuccess, onCancel }: UpdateSessionFormProps) => {
  const [sessionData, setSessionData] = useState({
    title: session.title,
    description: session.description || "",
    youtube_url: session.youtube_url || "",
    slides_url: session.slides_url || "",
    teacher_notes: session.teacher_notes || "",
    reflection_questions: session.reflection_questions || [""],
  });
  const [sessionImage, setSessionImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File, path: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${path}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("module-content")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("module-content")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailUrl = session.thumbnail_url;

      if (sessionImage) {
        thumbnailUrl = await handleImageUpload(sessionImage, "sessions");
      }

      const { error } = await supabase
        .from("sessions")
        .update({
          title: sessionData.title,
          description: sessionData.description,
          thumbnail_url: thumbnailUrl,
          youtube_url: sessionData.youtube_url,
          slides_url: sessionData.slides_url,
          teacher_notes: sessionData.teacher_notes,
          reflection_questions: sessionData.reflection_questions,
        })
        .eq("id", session.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: "Failed to update session",
        variant: "destructive",
      });
    }
  };

  const handleReflectionQuestionChange = (index: number, value: string) => {
    const newQuestions = [...sessionData.reflection_questions];
    newQuestions[index] = value;
    setSessionData({
      ...sessionData,
      reflection_questions: newQuestions,
    });
  };

  const addReflectionQuestion = () => {
    setSessionData({
      ...sessionData,
      reflection_questions: [...sessionData.reflection_questions, ""],
    });
  };

  const removeReflectionQuestion = (index: number) => {
    const newQuestions = sessionData.reflection_questions.filter((_, i) => i !== index);
    setSessionData({
      ...sessionData,
      reflection_questions: newQuestions,
    });
  };

  return (
    <form onSubmit={handleUpdateSession} className="space-y-4">
      <Input
        placeholder="Session Title"
        value={sessionData.title}
        onChange={(e) =>
          setSessionData({ ...sessionData, title: e.target.value })
        }
        required
      />
      <Textarea
        placeholder="Session Description"
        value={sessionData.description}
        onChange={(e) =>
          setSessionData({ ...sessionData, description: e.target.value })
        }
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files && setSessionImage(e.target.files[0])
        }
        className="cursor-pointer"
      />
      <Input
        placeholder="YouTube URL"
        value={sessionData.youtube_url}
        onChange={(e) =>
          setSessionData({ ...sessionData, youtube_url: e.target.value })
        }
      />
      <Input
        placeholder="Slides URL"
        value={sessionData.slides_url}
        onChange={(e) =>
          setSessionData({ ...sessionData, slides_url: e.target.value })
        }
      />
      <Textarea
        placeholder="Teacher's Notes"
        value={sessionData.teacher_notes}
        onChange={(e) =>
          setSessionData({
            ...sessionData,
            teacher_notes: e.target.value,
          })
        }
      />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Reflection Questions</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addReflectionQuestion}
          >
            Add Question
          </Button>
        </div>
        {sessionData.reflection_questions.map((question, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`Question ${index + 1}`}
              value={question}
              onChange={(e) =>
                handleReflectionQuestionChange(index, e.target.value)
              }
            />
            {sessionData.reflection_questions.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeReflectionQuestion(index)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="submit">Update Session</Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};