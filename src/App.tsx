import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import Index from "./pages/Index";
import Modules from "./pages/Modules";
import LearningDashboard from "./pages/LearningDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Login from "./pages/Login";
import MyNotes from "./pages/MyNotes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/modules"
              element={
                <PrivateRoute>
                  <Modules />
                </PrivateRoute>
              }
            />
            <Route
              path="/learning-dashboard"
              element={
                <PrivateRoute>
                  <LearningDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <PrivateRoute requireTeacher>
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/my-notes"
              element={
                <PrivateRoute>
                  <MyNotes />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;