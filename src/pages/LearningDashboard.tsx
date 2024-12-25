import React, { useState, useEffect } from "react";
import { LMSLayout } from "@/components/LMSLayout";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SlideViewer } from "@/components/SlideViewer";
import { NotesEditor } from "@/components/NotesEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Book,
  MessageSquare,
  Clock,
  Video,
  Presentation,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LearningDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const sessionId = searchParams.get("sessionId");
  const [currentSlideUrl, setCurrentSlideUrl] = useState<string | null>(null);
  const [currentTimestampId, setCurrentTimestampId] = useState<string | null>(
    null,
  );
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // [Previous query definitions remain the same...]
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;

      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          *,
          module:modules(*)
        `,
        )
        .eq("id", sessionId)
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
        throw new Error(
          "User must be logged in and session ID must be provided",
        );
      }

      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: session.user.id,
          session_id: sessionId,
          completed,
        },
        {
          onConflict: "user_id,session_id",
        },
      );

      if (error) throw error;
    },
    onSuccess: (_, completed) => {
      toast({
        title: "Success",
        description: completed
          ? "Session marked as complete!"
          : "Session marked as incomplete",
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
      .filter((ts) => ts.timestamp_seconds <= currentTime)
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

  if (isLoading || isLoadingProgress) {
    return (
      <LMSLayout>
        <div className="min-h-[calc(100vh-12rem)] container max-w-7xl py-12 space-y-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </LMSLayout>
    );
  }

  if (!sessionData) {
    return (
      <LMSLayout>
        <div className="min-h-[calc(100vh-12rem)] container max-w-7xl py-12">
          <Card className="p-8 text-center">
            <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">
              Session not found
            </p>
            <p className="text-gray-500 mt-2">
              The requested session could not be found
            </p>
          </Card>
        </div>
      </LMSLayout>
    );
  }

  return (
    <LMSLayout>
      <div className="min-h-[calc(100vh-12rem)] container max-w-7xl py-12">
        <div className="space-y-8">
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/modules")}
              className="gap-2 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Modules
            </Button>

            <Button
              size="lg"
              onClick={() =>
                toggleCompleteMutation.mutate(!userProgress?.completed)
              }
              disabled={toggleCompleteMutation.isPending}
              variant={userProgress?.completed ? "secondary" : "default"}
              className="gap-2 text-base"
            >
              {userProgress?.completed ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {userProgress?.completed
                ? "Mark as Incomplete"
                : "Mark as Complete"}
            </Button>
          </div>

          {/* Session Info Card */}
          <Card className="bg-gray-50 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={sessionData.module?.thumbnail_url || "/placeholder.svg"}
                  alt="Course thumbnail"
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
                        Session {sessionData.order_index}
                      </span>
                      {userProgress?.completed && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                      {sessionData.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        <span>{sessionData.module?.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>Duration TBD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Video and Slides Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Video className="h-5 w-5" />
                  Video Lesson
                </div>
                <VideoPlayer
                  src={sessionData.youtube_url || ""}
                  className="aspect-video rounded-lg overflow-hidden"
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Presentation className="h-5 w-5" />
                  Presentation Slides
                </div>
                <SlideViewer
                  src={
                    currentSlideUrl ||
                    sessionData.slides_url ||
                    "/placeholder.svg"
                  }
                  className="aspect-video rounded-lg overflow-hidden"
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <MessageSquare className="h-5 w-5" />
                Your Notes
              </div>
              <NotesEditor
                className="w-full border rounded-lg"
                currentTimestampId={currentTimestampId}
              />
            </div>
          </div>
        </div>
      </div>
    </LMSLayout>
  );
};

export default LearningDashboard;
