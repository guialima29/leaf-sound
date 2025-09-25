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
            <div className="inline-flex items-center space-x-4">
                <Button asChild className="bg-[#5DAA3B] hover:bg-[#43563B] hover:scale-105 flex justify-self-end text-lg" style={{ width: "150px", height: "40px" }}>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
    )
}