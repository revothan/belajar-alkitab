import { LMSLayout } from "@/components/LMSLayout";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SlideViewer } from "@/components/SlideViewer";
import { NotesEditor } from "@/components/NotesEditor";

const Index = () => {
  return (
    <LMSLayout>
      <div className="p-6 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Session 1</p>
          <h1 className="text-3xl font-bold">What on Earth Is the Hebrew Bible?</h1>
          <div className="flex items-center gap-2">
            <img
              src="/placeholder.svg"
              alt="Course thumbnail"
              className="w-8 h-8 rounded"
            />
            <div>
              <h2 className="font-medium">Introduction to the Hebrew Bible</h2>
              <p className="text-sm text-muted-foreground">Tim Mackie</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <VideoPlayer
            src="https://example.com/video.mp4"
            className="aspect-video"
          />
          <SlideViewer
            src="/lovable-uploads/5c3d0933-717a-4578-a539-cf12be6d1b82.png"
            className="aspect-video"
          />
        </div>

        <NotesEditor className="w-full" />
      </div>
    </LMSLayout>
  );
};

export default Index;