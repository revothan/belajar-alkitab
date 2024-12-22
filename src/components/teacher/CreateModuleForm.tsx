import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateModuleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateModuleForm = ({ onSuccess, onCancel }: CreateModuleFormProps) => {
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleImage, setModuleImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File, path: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${path}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("module-content")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("module-content")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailUrl = null;

      if (moduleImage) {
        thumbnailUrl = await handleImageUpload(moduleImage, "modules");
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

      onSuccess();
      setModuleTitle("");
      setModuleDescription("");
      setModuleImage(null);
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
    <Card>
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
              onChange={(e) => e.target.files && setModuleImage(e.target.files[0])}
              className="cursor-pointer"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create Module</Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};