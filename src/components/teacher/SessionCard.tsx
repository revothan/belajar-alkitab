import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Session {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  slides_url: string | null;
  teacher_notes: string | null;
  reflection_questions: string[] | null;
}

interface SessionCardProps {
  session: Session;
  index: number;
}

export const SessionCard = ({ session, index }: SessionCardProps) => {
  return (
    <Card key={session.id}>
      <CardHeader>
        <CardTitle className="text-lg">
          {index + 1}. {session.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {session.thumbnail_url && (
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="w-32 h-32 object-cover rounded"
            />
          )}
          <p className="text-sm text-muted-foreground">
            {session.description}
          </p>
          {session.youtube_url && (
            <p className="text-sm">
              YouTube: <a href={session.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{session.youtube_url}</a>
            </p>
          )}
          {session.slides_url && (
            <p className="text-sm">
              Slides: <a href={session.slides_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{session.slides_url}</a>
            </p>
          )}
          {session.teacher_notes && (
            <div>
              <h4 className="font-medium text-sm">Teacher's Notes:</h4>
              <p className="text-sm">{session.teacher_notes}</p>
            </div>
          )}
          {session.reflection_questions && (
            <div>
              <h4 className="font-medium text-sm">Reflection Questions:</h4>
              <ul className="list-disc list-inside text-sm">
                {session.reflection_questions.map((question, i) => (
                  <li key={i}>{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};