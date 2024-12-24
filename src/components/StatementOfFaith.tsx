import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const statements = [
  {
    title: "Allah Tritunggal",
    content:
      "Kami percaya kepada Allah yang kekal, personal, dan Mahakuasa - Pencipta dan Pemelihara alam semesta. Allah hadir dalam tiga Pribadi yang setara namun berbeda: Bapa yang mencurahkan kasih tanpa syarat, Anak yang menyatakan jalan kebenaran, dan Roh Kudus yang membimbing setiap langkah perjalanan iman kita.",
    image: "https://images.unsplash.com/photo-1502051400-dad986bddd4f?q=80&w=2871&auto=format&fit=crop",
  },
  {
    title: "Yesus Kristus",
    content:
      "Kami percaya Yesus Kristus adalah Allah yang berinkarnasi menjadi manusia - dikandung dari Roh Kudus, lahir dari perawan Maria, hidup tanpa dosa, mati untuk menebus dosa manusia, dan bangkit pada hari ketiga. Saat ini, Dia bertakhta di tempat tertinggi di surga dan akan datang kembali untuk menghakimi dan memperbarui segala sesuatu. Dia adalah jawaban ultimate bagi setiap pergumulan manusia.",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?q=80&w=2871&auto=format&fit=crop",
  },
  {
    title: "Roh Kudus",
    content:
      "Kami percaya Roh Kudus adalah Pribadi ilahi yang berdiam dalam setiap pengikut Kristus. Dia adalah Pembimbing yang menyatakan kebenaran, menguatkan kita untuk hidup seturut kehendak Allah, dan melengkapi kita dengan karunia-karunia rohani untuk menjadi agen perubahan di generasi ini.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2871&auto=format&fit=crop",
  },
  {
    title: "Alkitab",
    content:
      "Kami percaya Alkitab adalah firman Allah yang diinspirasikan sepenuhnya - ditulis oleh manusia namun sepenuhnya dibimbing oleh Allah. Setiap kata dalam 66 kitab ini dapat diandalkan sepenuhnya dan relevan untuk mengarahkan kehidupan di era modern. Alkitab adalah panduan kehidupan yang komprehensif dengan kebenaran yang tidak pernah berubah.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2871&auto=format&fit=crop",
  },
  {
    title: "Identitas Manusia",
    content:
      "Kami percaya setiap manusia diciptakan menurut gambar Allah dengan nilai yang tak terhingga. Kita diciptakan untuk memiliki relasi dengan Allah, namun dosa telah merusak hubungan ini. Setiap manusia membutuhkan intervensi ilahi untuk memulihkan relasi yang telah rusak. Dalam keadaan berdosa, kita tetap dikasihi Allah dengan kasih yang tak terbatas.",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=2871&auto=format&fit=crop",
  },
  {
    title: "Keselamatan",
    content:
      "Kami percaya keselamatan adalah anugerah Allah yang diberikan secara cuma-cuma - tidak dapat diperoleh melalui usaha atau prestasi manusia. Satu-satunya jalan untuk memulihkan hubungan dengan Allah adalah melalui iman kepada Yesus Kristus. Keselamatan adalah murni karya Allah yang diterima melalui iman.",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=2871&auto=format&fit=crop",
  },
  {
    title: "Kekekalan",
    content:
      "Kami percaya kehidupan tidak berakhir dengan eksistensi di bumi. Ada dua destinasi kekal: keterpisahan kekal dari Allah (neraka) atau sukacita kekal bersama Allah dalam surga dan bumi yang baru. Pilihan ini ditentukan melalui respons terhadap tawaran keselamatan Allah dalam Yesus Kristus - sebuah keputusan yang lebih penting dari segala pilihan hidup lainnya.",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=2871&auto=format&fit=crop",
  },
];

export function StatementOfFaith() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">Statement of Faith</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Fondasi dari seluruh konten, pengajaran, dan pedoman komunitas di BelajarAlkitab.com
        </p>
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {statements.map((statement, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-2 border-transparent hover:border-black transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={statement.image}
                          alt={statement.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{statement.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-4">
                        {statement.content}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}