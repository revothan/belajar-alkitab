import { useState } from "react";
import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Module {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

const TeacherDashboard = () => {
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleImage, setModuleImage] = useState<File | null>(null);
  const { toast } = useToast();

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModuleImage(file);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailUrl = null;

      if (moduleImage) {
        const fileExt = moduleImage.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("module-content")
          .upload(filePath, moduleImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("module-content")
          .getPublicUrl(filePath);

        thumbnailUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("modules").insert({
        title: moduleTitle,
        description: moduleDescription,
        thumbnail_url: thumbnailUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module created successfully",
      });

      setIsCreatingModule(false);
      setModuleTitle("");
      setModuleDescription("");
      setModuleImage(null);
      refetchModules();
    } catch (error) {
      console.error("Error creating module:", error);
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    }
  };

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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Module</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div>
                  <Input
                    placeholder="Module Title"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Module Description"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Module</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreatingModule(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules?.map((module) => (
            <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                {module.thumbnail_url && (
                  <img
                    src={module.thumbnail_url}
                    alt={module.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{module.description}</p>
                <Button className="mt-4" variant="outline">
                  Manage Sessions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LMSLayout>
  );
};

export default TeacherDashboard;