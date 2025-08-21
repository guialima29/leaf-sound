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
                <Card className="w-[300px] h-[300px]" key={idx}>
                    <CardHeader>
                        <Image src="/note-img.png" alt="" width={300} height={200} />
                    </CardHeader>
                    <CardContent>
                        <CardTitle className="text-lg font-semibold">{component.title}</CardTitle>
                        <p>{component.description}</p>
                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                    <p className="text-[14px] text-center">Last update: {component.lastUpdateDate} at {component.lastUpdateTime}</p>
                </Card>
            ))}
        </>
    )
}

// title, description, content, footer