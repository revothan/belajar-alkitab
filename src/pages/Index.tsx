import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";
import { Card, CardContent } from "@/components/ui/card";
import { User2, Video, Book, MessageCircle } from "lucide-react";

const Index = () => {
  // Replace VIDEO_ID with your actual YouTube video ID
  const VIDEO_ID = "F0lV3f2DvAY";

  return (
    <LMSLayout>
      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-primary">
            Selamat Datang di Belajar Alkitab!  
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Platform untuk Bertumbuh dalam Iman melalui Pembelajaran Alkitab yang Mudah dan Interaktif.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/modules">Mulai Belajar</Link>
          </Button>
          <div className="w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${VIDEO_ID}`}
              title="Bible Study Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Apa yang Kamu Dapatkan?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Video Pembelajaran</h3>
                <p className="text-muted-foreground">
                  Nikmati video interaktif beserta fitur catatan.
                </p>
                <img 
                  src="https://ucarecdn.com/ab15f013-4a4a-4e74-9657-f9cf359d5a85/-/preview/1000x640/"
                  alt="Study Material"
                  className="mt-4 rounded-lg w-full h-40 object-cover"
                />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Book className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Materi Terstruktur</h3>
                <p className="text-muted-foreground">
                  Pelajari materi yang disusun untuk membimbing perjalanan rohanimu.
                </p>
                <img 
                  src="https://ucarecdn.com/0b29ea28-5e00-44cf-9bec-35d787eca1c9/-/preview/1000x735/"
                  alt="Study Material"
                  className="mt-4 rounded-lg w-full h-40 object-cover"
                />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">QnA Session Coming Soon</h3>
                <p className="text-muted-foreground">
                  QnA dengan pengajar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructor Profile Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Pengajar Kami
          </h2>
          <Card className="max-w-3xl mx-auto hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                  <User2 className="w-24 h-24 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Pdt. Lorem Ipsum</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    M.Div., Sekolah Tinggi Teologi Reformed Indonesia
                  </p>
                  <p className="text-muted-foreground">
                    Melayani sebagai pengajar Alkitab selama lebih dari 15 tahun, 
                    Pdt. David memiliki panggilan khusus untuk membimbing jemaat 
                    dalam pemahaman Firman Tuhan yang mendalam. Dengan pengalaman 
                    pelayanan di berbagai gereja dan sebagai dosen di STT Reformed, 
                    beliau membawa perspektif yang kaya dalam pembelajaran Alkitab.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                    <Button variant="outline">
                      Lihat Profil Lengkap
                    </Button>
                    <Button>
                      Mulai Belajar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </LMSLayout>
  );
};

export default Index;