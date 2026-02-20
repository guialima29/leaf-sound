import Image from "next/image"
import CardHomeTemplate from "@/components/CardHomeTemplate"

export default function HomeExemplo() {
    return (
        <div className="flex items-center flex-col justify-center min-h-screen w-full">
            <h1 className="font-bold text-4xl text-[#2B3328] font-libre-caslon mb-15">Explore a sua criatividade musical 🧠🎵</h1>
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