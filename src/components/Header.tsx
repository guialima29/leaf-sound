import Image from "next/image"
import NavButton from "./NavButton"

export default function Header() {
    return (
        <div className="flex-row flex content-center gap-2.5">
            <Image src={'./lf-logo.svg'} alt="LeafSound" width={32} height={64} className="ml-2 mt-2"/>
            <NavButton title="LeafSound"/>
        </div>
    )
}