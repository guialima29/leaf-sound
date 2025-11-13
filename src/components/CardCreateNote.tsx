import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import Image from "next/image"

interface CreateNoteProp{
    onClick: () => void;
}

export default function CreateNoteCard({onClick}: CreateNoteProp) {

    return (
        <Card className="w-[300px] h-[360px] relative">
            <CardContent className=" flex justify-center items-center h-64">
                <Button onClick={onClick} variant="ghost" size="icon" className="p-4 hover:scale-110 rounded-[500px] w-full bg-transparent hover:bg-transparent focus-visible:ring-0 active:bg-transparent">
                    <Image src="/icon-plus.svg" alt="" width={150} height={150} />
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 w-full absolute bottom-10 justify-center items-center ">
                    <CardTitle className="font-semibold line-clamp-1 text-center text-[24px] ">Nova Anotação</CardTitle>
            </CardFooter>
        </Card>
    )
}