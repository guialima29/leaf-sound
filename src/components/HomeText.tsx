import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

export default function HomeText() {
    return (
        <div className="flex flex-row items-center justify-center gap-10">
            <Image src={'/home/lf-logo-violao.png'} alt="LeafSound Logo Violão" width={250} height={500}/>
            <div className="flex flex-col gap-8">
                <h1 className="font-bold text-5xl text-[#0E2E1F]" >ORGANIZE SUAS IDEIAS <br/>MUSICAIS COM O LEAFSOUND</h1>
                <h3 className="text-xl text-[#286125]">Um bloco de notas interativo para músicos, compositores <br/>e pessoas criativas</h3>
                <Button asChild className="bg-[#5DAA3B] hover:bg-[#43563B] font-bold w-45 h-13 text-xl text-center">
                    <Link href={'/login'}>Começar agora</Link>
                </Button>
            </div>
        </div>
    )
}