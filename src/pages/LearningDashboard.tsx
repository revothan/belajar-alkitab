import { LMSLayout } from "@/components/LMSLayout";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SlideViewer } from "@/components/SlideViewer";
import { NotesEditor } from "@/components/NotesEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LearningDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const sessionId = searchParams.get('sessionId');
  const [currentSlideUrl, setCurrentSlideUrl] = useState<string | null>(null);
  const [currentTimestampId, setCurrentTimestampId] = useState<string | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      
      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          module:modules(*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });

  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["user-progress", sessionId, session?.user?.id],
    queryFn: async () => {
      if (!sessionId || !session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("session_id", sessionId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId && !!session?.user?.id,
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      if (!session?.user?.id || !sessionId) {
        throw new Error("User must be logged in and session ID must be provided");
      }

      const { error } = await supabase
        .from("user_progress")
        .upsert({
          user_id: session.user.id,
          session_id: sessionId,
          completed
        }, {
          onConflict: 'user_id,session_id'
        });

      if (error) throw error;
    },
    onSuccess: (_, completed) => {
      toast({
        title: "Success",
        description: completed ? "Session marked as complete!" : "Session marked as incomplete",
      });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive",
      });
    },
  });

  const { data: timestamps } = useQuery({
    queryKey: ["timestamps", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      
      const { data, error } = await supabase
        .from("session_timestamps")
        .select("*")
        .eq("session_id", sessionId)
        .order("timestamp_seconds", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });

  const handleTimeUpdate = (currentTime: number) => {
    if (!timestamps) return;

    const currentTimestamp = timestamps
      .filter(ts => ts.timestamp_seconds <= currentTime)
      .sort((a, b) => b.timestamp_seconds - a.timestamp_seconds)[0];

    if (currentTimestamp?.slide_url) {
      setCurrentSlideUrl(currentTimestamp.slide_url);
      setCurrentTimestampId(currentTimestamp.id);
    }
  };

  useEffect(() => {
    if (sessionData?.slides_url) {
      setCurrentSlideUrl(sessionData.slides_url);
    }
  }, [sessionData]);

  if (isLoading) {
    return (
      <LMSLayout>
        <div className="container max-w-7xl py-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LMSLayout>
    );
  }

  if (!sessionData) {
    return (
      <LMSLayout>
        <div className="container max-w-7xl py-6">
          <p className="text-center text-muted-foreground">Session not found</p>
        </div>
      </LMSLayout>
    );
  }

  return (
    <LMSLayout>
      <div className="container max-w-7xl py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/modules')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Button>

            <Button
              onClick={() => toggleCompleteMutation.mutate(!userProgress?.completed)}
              disabled={toggleCompleteMutation.isPending}
              variant={userProgress?.completed ? "secondary" : "default"}
            >
              {userProgress?.completed ? (
                <XCircle className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {userProgress?.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
          </div>

          <header className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Session {sessionData.order_index}</p>
            <h1 className="text-3xl font-bold">{sessionData.title}</h1>
            <div className="flex items-center gap-2">
              <img
                src={sessionData.module?.thumbnail_url || "/placeholder.svg"}
                alt="Course thumbnail"
                className="w-8 h-8 rounded"
              />
              <div>
                <h2 className="font-medium">{sessionData.module?.title}</h2>
                <p className="text-sm text-muted-foreground">Teacher Name</p>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-6">
            <VideoPlayer
              src={sessionData.youtube_url || ""}
              className="aspect-video"
              onTimeUpdate={handleTimeUpdate}
            />
            <SlideViewer
              src={currentSlideUrl || sessionData.slides_url || "/placeholder.svg"}
              className="aspect-video"
            />
          </div>

          <NotesEditor className="w-full" currentTimestampId={currentTimestampId} />
        </div>
      </div>
    </LMSLayout>
  );
};

export default LearningDashboard;
