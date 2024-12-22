import { cn } from "@/lib/utils";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
  src: string;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({ src, className, onTimeUpdate }: VideoPlayerProps) {
  const handleProgress = (state: { playedSeconds: number }) => {
    onTimeUpdate?.(Math.floor(state.playedSeconds));
  };

  return (
    <div className={cn("rounded-lg overflow-hidden bg-black", className)}>
      <ReactPlayer
        url={src}
        width="100%"
        height="100%"
        controls
        onProgress={handleProgress}
        progressInterval={1000}
      />
    </div>
  );
}