import Image from "next/image"
import NavButton from "./NavButton"
import { Button } from "./ui/button"
import Link from "next/link"

export default function Header() {
    return (
        <div className="flex-row flex justify-between items-center max-w-full px-4 py-2">
            <div className="flex items-center space-x-4">
            <Image src={'./lf-logo.svg'} alt="LeafSound" width={64} height={64} className="ml-2 mt-2" style={{ width: "auto", height: "auto" }}/>
            <NavButton title="LeafSound"/>
            </div>
            <Button asChild className="bg-[#5DAA3B] hover:bg-[#43563B] flex justify-self-end text-xl w-40 h-12">
                <Link href="/login">Login/Registro</Link>
            </Button>
        </div>
    )
}