import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  MoreVertical,
  Play,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Modules = () => {
  const navigate = useNavigate();
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<{
    [key: string]: boolean;
  }>({});
  const { session } = useAuth();

  const { data: modules, isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(`*, sessions:sessions(*)`)
        .order("created_at", { ascending: true });
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
        <div className="min-h-[calc(100vh-12rem)] container max-w-5xl py-12 space-y-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </LMSLayout>
    );
  }

  const currentModule = modules?.[0];
  if (!currentModule) {
    return (
      <LMSLayout>
        <div className="min-h-[calc(100vh-12rem)] container max-w-5xl py-12">
          <Card className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">
              No modules available yet
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for new content!
            </p>
          </Card>
        </div>
      </LMSLayout>
    );
  }

  const sortedSessions = currentModule.sessions?.sort(
    (a, b) => a.order_index - b.order_index,
  );

  const calculateModuleProgress = () => {
    if (!sortedSessions || !userProgress) return 0;
    const completedSessions = userProgress.filter(
      (progress) =>
        progress.completed &&
        sortedSessions.some((session) => session.id === progress.session_id),
    ).length;
    return Math.round((completedSessions / sortedSessions.length) * 100);
  };

  const isSessionCompleted = (sessionId: string) => {
    return (
      userProgress?.some(
        (progress) => progress.session_id === sessionId && progress.completed,
      ) || false
    );
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
      <div className="min-h-[calc(100vh-12rem)] container max-w-5xl py-12 space-y-8">
        {/* Module Header */}
        <Card className="p-6 border-2">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={currentModule.thumbnail_url || "/placeholder.svg"}
                alt={currentModule.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                    Module 1
                  </span>
                  <Progress value={moduleProgress} className="w-32" />
                  <span className="text-sm font-medium">
                    {moduleProgress}% Complete
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {currentModule.title}
                </h1>
                <p
                  className={`text-gray-600 ${isDescriptionExpanded ? "" : "line-clamp-2"}`}
                >
                  {currentModule.description}
                </p>
                <Button
                  variant="link"
                  className="px-0 h-8"
                  onClick={() => setDescriptionExpanded((prev) => !prev)}
                >
                  {isDescriptionExpanded ? "Show Less" : "Read More"}
                </Button>
              </div>
              <div className="flex gap-3">
                {sortedSessions?.[0] && (
                  <Button
                    className="gap-2"
                    onClick={() =>
                      navigate(
                        `/learning-dashboard?moduleId=${currentModule.id}&sessionId=${sortedSessions[0].id}`,
                      )
                    }
                  >
                    <Play className="h-4 w-4" />
                    Continue Learning
                  </Button>
                )}
                <Button variant="outline">Share Module</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Sessions List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Content
          </h2>
          <div className="grid gap-4">
            {sortedSessions?.map((session, index) => (
              <Card
                key={session.id}
                className={`transform transition-all duration-200 hover:scale-[1.01] hover:shadow-md cursor-pointer
                  ${isSessionCompleted(session.id) ? "bg-gray-50" : "bg-white"}`}
                onClick={() =>
                  navigate(
                    `/learning-dashboard?moduleId=${currentModule.id}&sessionId=${session.id}`,
                  )
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={session.thumbnail_url || "/placeholder.svg"}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          Session {index + 1}
                        </span>
                        {isSessionCompleted(session.id) && (
                          <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">
                        {session.title}
                      </h3>
                      <p
                        className={`text-sm text-gray-600 ${expandedSessions[session.id] ? "" : "line-clamp-2"}`}
                      >
                        {session.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSessionDescription(session.id);
                          }}
                        >
                          {expandedSessions[session.id]
                            ? "Show Less"
                            : "Read More"}
                        </Button>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Duration TBD
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
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

