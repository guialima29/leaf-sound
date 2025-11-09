import {
    Card,
    // CardAction,
    CardContent,
    // CardDescription,
    CardFooter,
    // CardHeader,
    CardTitle,
} from "@/components/ui/card"
// import Link from "next/link"
import Image from "next/image"
// import { Button } from "./ui/button"

export default function CreateNoteCard() {
    return (
        <Card className="w-[300px] h-[360px] relative">
            {/* <CardHeader>
            </CardHeader> */}
            <CardContent className="space-y-2">
                <Image className="flex items-center justify-center" src="/plus-icon.png" alt="" width={100} height={100} />
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 w-full absolute bottom-10 justify-center items-center ">
                <CardTitle className="font-semibold line-clamp-1 text-center text-[24px]">Nova Anotação</CardTitle>
            </CardFooter>
        </Card>
    )
}