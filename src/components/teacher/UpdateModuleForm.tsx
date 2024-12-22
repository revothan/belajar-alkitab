import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Module {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

interface UpdateModuleFormProps {
  module: Module;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UpdateModuleForm = ({ module, onSuccess, onCancel }: UpdateModuleFormProps) => {
  const [moduleTitle, setModuleTitle] = useState(module.title);
  const [moduleDescription, setModuleDescription] = useState(module.description || "");
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

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailUrl = module.thumbnail_url;

      if (moduleImage) {
        thumbnailUrl = await handleImageUpload(moduleImage, "modules");
      }

      const { error } = await supabase
        .from("modules")
        .update({
          title: moduleTitle,
          description: moduleDescription,
          thumbnail_url: thumbnailUrl,
        })
        .eq("id", module.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating module:", error);
      toast({
        title: "Error",
        description: "Failed to update module",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleUpdateModule} className="space-y-4">
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
        <Button type="submit">Update Module</Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};