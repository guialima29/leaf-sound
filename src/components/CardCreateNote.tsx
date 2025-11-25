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
        <Card className="flex justify-center w-[300px] h-[360px]">
            <CardContent className=" flex justify-center gap-10"> 
                <Button onClick={onClick} variant="ghost" size="icon" className="flex flex-col p-4 hover:scale-110 cursor-pointer rounded-[500px] w-full bg-transparent hover:bg-transparent focus-visible:ring-0 active:bg-transparent">
                    <Image src="/icon-plus.svg" alt="" width={70} height={70} />
                    <p className="text-lg font-semibold" >Nova anotação</p>
                </Button>
            </CardContent>
        </Card>
    )
}