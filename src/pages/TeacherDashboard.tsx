import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreateModuleForm } from "@/components/teacher/CreateModuleForm";
import { CreateSessionForm } from "@/components/teacher/CreateSessionForm";

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
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

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

  const handleModuleSuccess = () => {
    setIsCreatingModule(false);
    refetchModules();
  };

  const handleSessionSuccess = () => {
    setIsCreatingSession(false);
    refetchSessions();
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
          <CreateModuleForm
            onSuccess={handleModuleSuccess}
            onCancel={() => setIsCreatingModule(false)}
          />
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
                  <CreateSessionForm
                    moduleId={module.id}
                    onSuccess={handleSessionSuccess}
                    onCancel={() => {
                      setIsCreatingSession(false);
                      setSelectedModuleId(null);
                    }}
                  />
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