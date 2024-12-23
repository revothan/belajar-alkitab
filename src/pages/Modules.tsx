import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Modules = () => {
  const navigate = useNavigate();
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<{ [key: string]: boolean }>({});
  const { session } = useAuth();

  const { data: modules, isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(`
          *,
          sessions:sessions(*)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["user-progress", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoadingModules || isLoadingProgress) {
    return (
      <LMSLayout>
        <div className="container max-w-4xl py-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LMSLayout>
    );
  }

  const currentModule = modules?.[0];
  if (!currentModule) {
    return (
      <LMSLayout>
        <div className="container max-w-4xl py-6">
          <p className="text-center text-muted-foreground">No modules available</p>
        </div>
      </LMSLayout>
    );
  }

  const sortedSessions = currentModule.sessions?.sort((a, b) => a.order_index - b.order_index);

  const calculateModuleProgress = () => {
    if (!sortedSessions || !userProgress) return 0;
    const completedSessions = userProgress.filter(
      progress => progress.completed && sortedSessions.some(session => session.id === progress.session_id)
    ).length;
    return Math.round((completedSessions / sortedSessions.length) * 100);
  };

  const isSessionCompleted = (sessionId: string) => {
    return userProgress?.some(progress => progress.session_id === sessionId && progress.completed) || false;
  };

  const toggleSessionDescription = (sessionId: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const moduleProgress = calculateModuleProgress();

  return (
    <LMSLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={currentModule.thumbnail_url || "/placeholder.svg"} 
              alt={currentModule.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Module 1</h4>
            <h1 className="text-2xl font-bold">{currentModule.title}</h1>
            <p className={`text-sm text-muted-foreground ${isDescriptionExpanded ? "" : "line-clamp-2"}`}>
              {currentModule.description}
            </p>
            <Button 
              variant="link" 
              size="sm" 
              className="p-0"
              onClick={() => setDescriptionExpanded(prev => !prev)}
            >
              {isDescriptionExpanded ? "Show Less" : "Read More"}
            </Button>
          </div>
          <Button variant="outline" size="sm">Share Class</Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Progress value={moduleProgress} className="w-32" />
              <span className="text-sm text-muted-foreground">{moduleProgress}% Complete</span>
            </div>
            {sortedSessions?.[0] && (
              <Button 
                size="sm" 
                className="gap-1.5 w-fit"
                onClick={() => navigate(`/learning-dashboard?moduleId=${currentModule.id}&sessionId=${sortedSessions[0].id}`)}
              >
                <Play className="h-3 w-3" />
                Begin Session 1
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <div className="grid gap-4">
            {sortedSessions?.map((session, index) => (
              <Card 
                key={session.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/learning-dashboard?moduleId=${currentModule.id}&sessionId=${session.id}`)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={session.thumbnail_url || "/placeholder.svg"} 
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Session {index + 1}</h3>
                          {isSessionCompleted(session.id) && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className={`text-sm text-muted-foreground ${expandedSessions[session.id] ? "" : "line-clamp-2"}`}>
                          {session.description}
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSessionDescription(session.id);
                          }}
                        >
                          {expandedSessions[session.id] ? "Show Less" : "Read More"}
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Duration TBD</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </LMSLayout>
  );
};

export default Modules;