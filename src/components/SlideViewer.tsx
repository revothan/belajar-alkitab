import { cn } from "@/lib/utils";

interface SlideViewerProps {
  src: string;
  className?: string;
}

export function SlideViewer({ src, className }: SlideViewerProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden bg-white shadow-lg", className)}>
      <img src={src} alt="Slide" className="w-full h-full object-contain" />
    </div>
  );
}