import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

export default function HomeText() {
    return (
        <div className="flex flex-row items-center justify-center gap-10">
            <div className="flex flex-col gap-12 items-center">
                <h1 className="font-bold font-libre-caslon text-[60px] text-[#2B3328]" >Crie com LeafSound</h1>
                <div className="max-w-570px flex flex-row items-center gap-2">
                    <Image src={'/home/lf-logo-violao.png'} alt="LeafSound Logo Violão" width={60} height={105} />
                    <h3 className="text-xl">Desbloqueia a sua imaginação com um<br/>bloco de notas interativo para músicos,<br/>compositores e criativos.</h3>
                </div>
                <Button asChild className="bg-[#5DAA3B] hover:bg-[#43563B] hover:scale-105 font-bold w-45 h-13 text-xl text-center drop-shadow-lg/25">
                    <Link href={'/login'}>Começar agora</Link>
                </Button>
            </div>
        </div>
    )
}

// style={{ width: "auto", height: "auto" }}