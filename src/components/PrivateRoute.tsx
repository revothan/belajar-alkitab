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

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate("/login");
      } else if (requireTeacher && profile?.role !== "teacher") {
        navigate("/");
      }
    }
  }, [session, isLoading, navigate, requireTeacher, profile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (requireTeacher && profile?.role !== "teacher") {
    return null;
  }

  return <>{children}</>;
};