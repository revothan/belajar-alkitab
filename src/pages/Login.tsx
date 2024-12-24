import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, Heart, Users } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    if (session) {
      navigate("/modules");
    }
  }, [session, navigate]);

  const customTheme = {
    ...ThemeSupa,
    default: {
      colors: {
        brand: "#000000",
        brandAccent: "#333333",
        inputBackground: "white",
        inputBorder: "#E5E7EB",
        inputText: "#000000",
        inputPlaceholder: "#6B7280",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-4xl px-4 py-8 flex flex-col md:flex-row items-center gap-8">
        {/* Left side - Welcome message */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Book className="w-8 h-8 text-black" />
            <h1 className="text-2xl font-semibold text-black">
              BelajarAlkitab.com
            </h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-black">
              Join Our Bible Learning Community
            </h2>
            <p className="text-lg text-gray-600">
              Discover the joy of studying God's Word together
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-5 h-5 text-black" />
              <span>Engaging Content</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-black" />
              <span>Community Support</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card className="w-full md:w-1/2 bg-white shadow-md border border-gray-200">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-semibold">
              {activeTab === "signin" ? "Welcome Back!" : "Create Your Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "signin"
                ? "Great to see you again! Continue your learning journey."
                : "Start your Bible learning journey today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="signin"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger
                  value="signin"
                  className="text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: customTheme,
                    style: {
                      button: {
                        background: "#000000",
                        color: "white",
                        borderRadius: "8px",
                        padding: "10px",
                        fontSize: "16px",
                        fontWeight: "500",
                        "&:hover": {
                          background: "#333333",
                        },
                      },
                      anchor: {
                        color: "#000000",
                        fontWeight: "500",
                      },
                      container: {
                        borderRadius: "12px",
                      },
                      input: {
                        borderRadius: "8px",
                        padding: "10px",
                      },
                    },
                  }}
                  providers={[]}
                  view={activeTab === "signin" ? "sign_in" : "sign_up"}
                  theme="custom"
                />
              </TabsContent>

              <TabsContent value="signup">
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: customTheme,
                    style: {
                      button: {
                        background: "#000000",
                        color: "white",
                        borderRadius: "8px",
                        padding: "10px",
                        fontSize: "16px",
                        fontWeight: "500",
                        "&:hover": {
                          background: "#333333",
                        },
                      },
                      anchor: {
                        color: "#000000",
                        fontWeight: "500",
                      },
                      container: {
                        borderRadius: "12px",
                      },
                      input: {
                        borderRadius: "8px",
                        padding: "10px",
                      },
                    },
                  }}
                  providers={[]}
                  view="sign_up"
                  theme="custom"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
