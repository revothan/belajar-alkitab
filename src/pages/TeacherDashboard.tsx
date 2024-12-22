import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Module {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

interface Session {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  slides_url: string | null;
  teacher_notes: string | null;
  reflection_questions: string[] | null;
  order_index: number;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleImage, setModuleImage] = useState<File | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
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

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [session, isLoading, navigate]);

  const { data: modules, refetch: refetchModules } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Module[];
    },
  });

  const { data: sessions, refetch: refetchSessions } = useQuery({
    queryKey: ["sessions", selectedModuleId],
    queryFn: async () => {
      if (!selectedModuleId) return [];
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("module_id", selectedModuleId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Session[];
    },
    enabled: !!selectedModuleId,
  });

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

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailUrl = null;

      if (moduleImage) {
        thumbnailUrl = await handleImageUpload(moduleImage, "modules");
      }

      const { error } = await supabase.from("modules").insert({
        title: moduleTitle,
        description: moduleDescription,
        thumbnail_url: thumbnailUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module created successfully",
      });

      setIsCreatingModule(false);
      setModuleTitle("");
      setModuleDescription("");
      setModuleImage(null);
      refetchModules();
    } catch (error) {
      console.error("Error creating module:", error);
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;

    try {
      let thumbnailUrl = null;

      if (sessionImage) {
        thumbnailUrl = await handleImageUpload(sessionImage, "sessions");
      }

      const { count } = await supabase
        .from("sessions")
        .select("*", { count: "exact" })
        .eq("module_id", selectedModuleId);

      const { error } = await supabase.from("sessions").insert({
        module_id: selectedModuleId,
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

      setIsCreatingSession(false);
      setSessionData({
        title: "",
        description: "",
        youtube_url: "",
        slides_url: "",
        teacher_notes: "",
        reflection_questions: [""],
      });
      setSessionImage(null);
      refetchSessions();
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <LMSLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <Button onClick={() => setIsCreatingModule(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Module
          </Button>
        </div>

        {isCreatingModule && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Module</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div>
                  <Input
                    placeholder="Module Title"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Module Description"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setModuleImage(e.target.files[0])}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Module</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreatingModule(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {modules?.map((module) => (
            <Card key={module.id} className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{module.title}</CardTitle>
                    {module.thumbnail_url && (
                      <img
                        src={module.thumbnail_url}
                        alt={module.title}
                        className="mt-2 w-32 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setIsCreatingSession(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                
                {isCreatingSession && selectedModuleId === module.id && (
                  <Card className="mb-6">
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
                            onClick={() => {
                              setIsCreatingSession(false);
                              setSelectedModuleId(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sessions">
                    <AccordionTrigger>View Sessions</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {sessions?.map((session, index) => (
                          <Card key={session.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {index + 1}. {session.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
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
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LMSLayout>
  );
};

export default TeacherDashboard;
