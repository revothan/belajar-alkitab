import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LMSLayout } from "@/components/LMSLayout";
import { Card, CardContent } from "@/components/ui/card";
import { User2, Video, Book, MessageCircle, ChevronRight } from "lucide-react";
import { StatementOfFaith } from "@/components/StatementOfFaith";

const Index = () => {
  return (
    <LMSLayout>
      {/* Hero Section with Diagonal Design */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        <div className="container max-w-7xl mx-auto py-32 px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Selamat Datang di Belajar Alkitab!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mb-8">
                Platform untuk Bertumbuh dalam Iman melalui Pembelajaran Alkitab
                yang Mudah dan Interaktif.
              </p>
              <Button
                asChild
                size="lg"
                className="group bg-white text-black hover:bg-gray-100"
              >
                <Link to="/modules" className="flex items-center gap-2">
                  Mulai Belajar
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 w-full max-w-lg">
              <div className="relative">
                <div className="absolute -inset-1 bg-white/20 rounded-lg blur"></div>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="https://ucarecdn.com/c0225401-d275-4571-a9ee-5681e8714fa2/-/preview/1000x565/"
                    alt="Bible Study"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Hover Effects */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-16">
            Apa yang Kamu Dapatkan?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-black">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center mb-6 mx-auto transition-colors">
                  <Video className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Video Pembelajaran</h3>
                <p className="text-gray-600 mb-6">
                  Nikmati video interaktif beserta fitur catatan.
                </p>
                <div className="relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <img
                    src="https://ucarecdn.com/311ab53d-5e11-4478-b693-96917b830257/-/preview/1000x565/"
                    alt="Study Material"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-black">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center mb-6 mx-auto transition-colors">
                  <Book className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Materi Terstruktur</h3>
                <p className="text-gray-600 mb-6">
                  Pelajari materi yang disusun untuk membimbing perjalanan
                  rohanimu.
                </p>
                <div className="relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <img
                    src="https://ucarecdn.com/1bcf1ff2-8ba1-4c80-9cb5-da593afbb566/-/preview/1000x565/"
                    alt="Study Material"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-black">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center mb-6 mx-auto transition-colors">
                  <MessageCircle className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  QnA Session Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">QnA dengan pengajar.</p>
                <div className="h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statement of Faith Section */}
      <StatementOfFaith />

      {/* Instructor Profile Section with Modern Card Design */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-16">
            Pengajar Kami
          </h2>
          <Card className="max-w-4xl mx-auto hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-black overflow-hidden">
            <CardContent className="p-12">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-56 h-56 rounded-full bg-black/5 flex items-center justify-center p-1 border-2 border-black">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <User2 className="w-32 h-32 text-black" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-3">Pdt. Lorem Ipsum</h3>
                  <p className="text-xl text-gray-600 mb-6">
                    M.Div., Sekolah Tinggi Teologi Reformed Indonesia
                  </p>
                  <p className="text-gray-600 mb-8">
                    Melayani sebagai pengajar Alkitab selama lebih dari 15
                    tahun, Pdt. David memiliki panggilan khusus untuk membimbing
                    jemaat dalam pemahaman Firman Tuhan yang mendalam. Dengan
                    pengalaman pelayanan di berbagai gereja dan sebagai dosen di
                    STT Reformed, beliau membawa perspektif yang kaya dalam
                    pembelajaran Alkitab.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Button
                      variant="outline"
                      className="group border-2 border-black hover:bg-black hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        Lihat Profil Lengkap
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                    <Button className="group bg-black text-white hover:bg-gray-800">
                      <span className="flex items-center gap-2">
                        Mulai Belajar
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
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
