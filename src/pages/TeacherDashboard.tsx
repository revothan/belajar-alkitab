import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { CreateModuleForm } from "@/components/teacher/CreateModuleForm";
import { ModuleCard } from "@/components/teacher/ModuleCard";

interface Module {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [session, isLoading, navigate]);

  useEffect(() => {
    // Subscribe to real-time changes for modules
    const modulesChannel = supabase
      .channel('modules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modules'
        },
        () => {
          // Invalidate and refetch modules query
          queryClient.invalidateQueries({ queryKey: ['modules'] });
        }
      )
      .subscribe();

    // Subscribe to real-time changes for sessions
    const sessionsChannel = supabase
      .channel('sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions'
        },
        () => {
          // Invalidate and refetch modules query to update sessions
          queryClient.invalidateQueries({ queryKey: ['modules'] });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(modulesChannel);
      supabase.removeChannel(sessionsChannel);
    };
  }, [queryClient]);

  const { data: modules, isLoading: isLoadingModules } = useQuery({
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

  const handleModuleSuccess = () => {
    setIsCreatingModule(false);
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
            <ModuleCard
              key={module.id}
              module={module}
              onSessionCreate={() => {}}
              onModuleUpdate={() => {}}
              onModuleDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </LMSLayout>
  );
};

export default TeacherDashboard;