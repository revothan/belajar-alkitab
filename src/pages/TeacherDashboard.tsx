import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

  const handleModuleSuccess = () => {
    setIsCreatingModule(false);
    refetchModules();
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
              onSessionCreate={refetchModules}
            />
          ))}
        </div>
      </div>
    </LMSLayout>
  );
};

export default TeacherDashboard;