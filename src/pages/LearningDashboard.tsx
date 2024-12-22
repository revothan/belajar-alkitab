import { LMSLayout } from "@/components/LMSLayout";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SlideViewer } from "@/components/SlideViewer";
import { NotesEditor } from "@/components/NotesEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LearningDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const sessionId = searchParams.get('sessionId');
  const [currentSlideUrl, setCurrentSlideUrl] = useState<string | null>(null);
  const [currentTimestampId, setCurrentTimestampId] = useState<string | null>(null);

  const { data: session, isLoading } = useQuery({
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

    // Find the most recent timestamp that's less than or equal to the current time
    const currentTimestamp = timestamps
      .filter(ts => ts.timestamp_seconds <= currentTime)
      .sort((a, b) => b.timestamp_seconds - a.timestamp_seconds)[0];

    if (currentTimestamp?.slide_url) {
      setCurrentSlideUrl(currentTimestamp.slide_url);
      setCurrentTimestampId(currentTimestamp.id);
    }
  };

  // Set initial slide
  useEffect(() => {
    if (session?.slides_url) {
      setCurrentSlideUrl(session.slides_url);
    }
  }, [session]);

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

  if (!session) {
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
          <Button
            variant="ghost"
            onClick={() => navigate('/modules')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>

          <header className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Session {session.order_index}</p>
            <h1 className="text-3xl font-bold">{session.title}</h1>
            <div className="flex items-center gap-2">
              <img
                src={session.module?.thumbnail_url || "/placeholder.svg"}
                alt="Course thumbnail"
                className="w-8 h-8 rounded"
              />
              <div>
                <h2 className="font-medium">{session.module?.title}</h2>
                <p className="text-sm text-muted-foreground">Teacher Name</p>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-6">
            <VideoPlayer
              src={session.youtube_url || ""}
              className="aspect-video"
              onTimeUpdate={handleTimeUpdate}
            />
            <SlideViewer
              src={currentSlideUrl || session.slides_url || "/placeholder.svg"}
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