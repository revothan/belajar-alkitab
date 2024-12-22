import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface Timestamp {
  id: string;
  timestamp_seconds: number;
  slide_url: string | null;
}

interface TimestampItemProps {
  timestamp: Timestamp;
  isEditing: boolean;
  editTimestamp: string;
  onEdit: () => void;
  onUpdate: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditTimestampChange: (value: string) => void;
}

export function TimestampItem({
  timestamp: ts,
  isEditing,
  editTimestamp,
  onEdit,
  onUpdate,
  onCancel,
  onDelete,
  onEditTimestampChange,
}: TimestampItemProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-2 border rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={editTimestamp}
              onChange={(e) => onEditTimestampChange(e.target.value)}
              pattern="\d{1,2}:\d{2}"
              title="Format: mm:ss (e.g., 1:30)"
              className="w-24"
            />
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={onUpdate}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <span>
              {Math.floor(ts.timestamp_seconds / 60)}:
              {(ts.timestamp_seconds % 60).toString().padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
      {ts.slide_url && (
        <img
          src={ts.slide_url}
          alt="Slide"
          className="w-32 h-32 object-cover rounded"
        />
      )}
    </div>
  );
}