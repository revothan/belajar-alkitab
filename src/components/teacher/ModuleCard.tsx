import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SessionCard } from "./SessionCard";
import { CreateSessionForm } from "./CreateSessionForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

interface ModuleCardProps {
  module: Module;
  onSessionCreate: () => void;
}

export const ModuleCard = ({ module, onSessionCreate }: ModuleCardProps) => {
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const { data: sessions } = useQuery({
    queryKey: ["sessions", module.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("module_id", module.id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Session[];
    },
  });

  const handleSessionSuccess = () => {
    setIsCreatingSession(false);
    setSelectedModuleId(null);
    onSessionCreate();
  };

  return (
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
          <AccordionItem value="sessions" className="border-none">
            <AccordionTrigger>View Sessions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {sessions?.map((session, index) => (
                  <SessionCard key={session.id} session={session} index={index} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};