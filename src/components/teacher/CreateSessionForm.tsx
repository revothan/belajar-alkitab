import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CreateSessionFormProps {
  moduleId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateSessionForm = ({ moduleId, onSuccess, onCancel }: CreateSessionFormProps) => {
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    slides_url: "",
    teacher_notes: "",
    reflection_questions: [""],
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

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailUrl = null;

      if (sessionImage) {
        thumbnailUrl = await handleImageUpload(sessionImage, "sessions");
      }

      const { count } = await supabase
        .from("sessions")
        .select("*", { count: "exact" })
        .eq("module_id", moduleId);

      const { error } = await supabase.from("sessions").insert({
        module_id: moduleId,
        title: sessionData.title,
        description: sessionData.description,
        thumbnail_url: thumbnailUrl,
        youtube_url: sessionData.youtube_url,
        slides_url: sessionData.slides_url,
        teacher_notes: sessionData.teacher_notes,
        reflection_questions: sessionData.reflection_questions,
        order_index: (count || 0) + 1,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session created successfully",
      });

      onSuccess();
      setSessionData({
        title: "",
        description: "",
        youtube_url: "",
        slides_url: "",
        teacher_notes: "",
        reflection_questions: [""],
      });
      setSessionImage(null);
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session",
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
    <Card>
      <CardHeader>
        <CardTitle>Create New Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateSession} className="space-y-4">
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
            <Button type="submit">Create Session</Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};