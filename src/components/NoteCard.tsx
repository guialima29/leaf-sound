import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { componentsNotes } from "@/constants/constNoteCards"
import { Button } from "./ui/button"

interface ComponentNote {
    title: string;
    description: string;
    lastUpdateDate: string;
    lastUpdateTime: string;
}

export default function NoteCard() {
    return (
        <>
            {componentsNotes.map((component: ComponentNote, idx: number) => (
                <Card className="w-[300px] h-[360px]" key={idx}>
                    <CardHeader>
                        <Image src="/note-img.png" alt="" width={300} height={200} />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <CardTitle className="text-lg font-semibold">{component.title}</CardTitle>
                        <p>{component.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 ">
                        <Button className="w-full">Acessar</Button>
                        <p className="text-[14px]   ">Last update: {component.lastUpdateDate} at {component.lastUpdateTime}</p>    
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}

// title, description, content, footer