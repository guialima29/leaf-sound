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
import Link from "next/link";
import { Button } from "./ui/button"

interface ComponentNote {
    title: string;
    description: string;
    lastUpdateDate: string;
    lastUpdateTime: string;
}

export default function NoteCard(title: string, description: string, lastUpdateDate: string, lastUpdateTime:string, href: string, idx: number) {
    return (
                <Card className="w-[300px] h-[360px] relative" key={idx}>
                    <CardHeader>
                        <Image src="/note-img.png" alt="" width={300} height={200} />
                    </CardHeader>
                    <CardContent className="space-y-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
                        <p className="max-w-[300px] max-h-[75px] line-clamp-3">{description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3 w-full absolute bottom-2 justify-center items-center ">
                        <Link href={href}>
                            <Button className="w-full">Acessar</Button>
                        </Link>
                        <p className="text-[14px] ">Last update: {lastUpdateDate} at {lastUpdateTime}</p>    
                    </CardFooter>
                </Card>
    )
}

// title, description, content, footer