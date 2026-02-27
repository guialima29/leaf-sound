import Image from "next/image"
import CardHomeTemplate from "@/components/CardHomeTemplate"

export default function HomeExemplo() {
    return (
        <div className="flex items-center flex-col justify-center min-h-screen w-full">
            <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Explore sua criatividade
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Abra o coração e deixe a mente te guiar
          </h2>
        </div>
            <div className="relative">
                <div>
                     <Image src={"/home/song-bg.png"} alt="Background" width={1025} height={571} className="block max-w-full h-auto"/>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-[60px] z-10">
                    <CardHomeTemplate />
                </div>
            </div>
        </div>
    );
}