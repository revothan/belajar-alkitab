import { LMSLayout } from "@/components/LMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, PlayCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Session {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  thumbnail: string;
  sessions: Session[];
}

const currentModule: Module = {
  id: 1,
  title: "The Shape of the Hebrew Bible",
  description: "What is the Hebrew Bible? Explore this and how it's organized as the TaNaK.",
  progress: 3,
  thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  sessions: [
    {
      id: 1,
      title: "What on Earth Is the Hebrew Bible?",
      description: "Acknowledge and embrace both your own assumptions and the authors' intentions of a given text.",
      duration: "22 Minutes",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      id: 2,
      title: "How Jesus and the Apostles Read Their Bibles",
      description: "What was the Hebrew Bible that Jesus and the Apostles read? What was all about? Discover what they believed to be the main essence of the Hebrew Bible.",
      duration: "25 Minutes",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    },
    {
      id: 3,
      title: "The Ancient Shape of Scriptures",
      description: "Study the ancient shape of the Hebrew Bible and why this organization is significant for readers today.",
      duration: "28 Minutes",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 4,
      title: "Seams Between Texts in the Dead Sea Scrolls",
      description: "What do the seams of the Dead Sea Scrolls teach us about the Hebrew Bible? Jump in and find out!",
      duration: "31 Minutes",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      id: 5,
      title: "The Prophet to Come: The Seams of the Torah and Prophets",
      description: "Trace the seams of the Torah and the Prophets to discover a message about an anticipated future hope.",
      duration: "32 Minutes",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    },
    {
      id: 6,
      title: "The Prophet to Come: Psalms 1 and 2",
      description: "Gain further insight into how Psalms 1 and 2 build onto the portrait of the promised prophet who will rescue humanity.",
      duration: "28 Minutes",
      thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334"
    }
  ]
};

const Modules = () => {
  const navigate = useNavigate();

  return (
    <LMSLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={currentModule.thumbnail} 
              alt={currentModule.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Module 1</h4>
            <h1 className="text-2xl font-bold">{currentModule.title}</h1>
            <p className="text-sm text-muted-foreground">{currentModule.description}</p>
          </div>
          <Button variant="outline" size="sm">Share Class</Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Progress value={currentModule.progress} className="w-32" />
              <span className="text-sm text-muted-foreground">{currentModule.progress}% Complete</span>
            </div>
            <Button 
              size="sm" 
              className="gap-1.5 w-fit"
              onClick={() => navigate('/')}
            >
              <Play className="h-3 w-3" />
              Begin Session 1
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <div className="grid gap-4">
            {currentModule.sessions.map((session) => (
              <Card 
                key={session.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate('/')}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={session.thumbnail} 
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">Session {session.id}</h3>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{session.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </LMSLayout>
  );
};

export default Modules;