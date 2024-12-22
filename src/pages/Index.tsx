import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";

const Index = () => {
  return (
    <LMSLayout>
      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto py-20 px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter">
              Belajar Alkitab
            </h1>
            <p className="text-xl text-muted-foreground">
              Pelajari Alkitab dengan cara yang interaktif dan mendalam. Temukan wawasan baru dalam perjalanan rohani Anda.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/learning-dashboard">Mulai Belajar</Link>
            </Button>
          </div>
          <div className="flex-1">
            <img
              src="/lovable-uploads/5c3d0933-717a-4578-a539-cf12be6d1b82.png"
              alt="Bible Study"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Video Pembelajaran</h3>
              <p className="text-muted-foreground">
                Akses video pembelajaran berkualitas tinggi dari pengajar terpercaya.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Materi Terstruktur</h3>
              <p className="text-muted-foreground">
                Materi pembelajaran yang disusun secara sistematis dan mudah dipahami.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Komunitas</h3>
              <p className="text-muted-foreground">
                Bergabung dengan komunitas pembelajar untuk diskusi dan berbagi wawasan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </LMSLayout>
  );
};

export default Index;