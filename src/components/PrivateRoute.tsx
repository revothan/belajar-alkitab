import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireTeacher?: boolean;
}

export const PrivateRoute = ({ children, requireTeacher = false }: PrivateRouteProps) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!isLoading && !isProfileLoading) {
      if (!session) {
        navigate("/login");
      } else if (!profile) {
        // If no profile exists, redirect to login
        navigate("/login");
      } else if (requireTeacher && profile.role !== "teacher") {
        navigate("/");
      }
    }
  }, [session, isLoading, navigate, requireTeacher, profile, isProfileLoading]);

  if (isLoading || isProfileLoading) {
    return <div>Loading...</div>;
  }

  if (!session || !profile) {
    return null;
  }

  if (requireTeacher && profile.role !== "teacher") {
    return null;
  }

  return <>{children}</>;
};