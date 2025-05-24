import Image from "next/image"
import CardHomeTemplate from "./CardHomeTemplate"

export default function HomeExemplo() {
    return (
        <div className="relative flex justify-center w-auto">
            <div className="flex justify-center">
                <Image src={"/home/song-bg.png"} alt="Background" width={1025} height={571}/>
            </div>
            <CardHomeTemplate/>
        </div>
    )
}