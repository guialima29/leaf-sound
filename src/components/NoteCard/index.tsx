import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "../ui/button"

interface NoteCardProps {
    id?: string;
    title: string;
    description: string;
    lastUpdateDate: string;
    lastUpdateTime: string;
    href?: string;
    isFavorite?: boolean;
    idx: number;
}

export default function NoteCard({
    id,
    title,
    description,
    lastUpdateDate,
    lastUpdateTime,
    href,
    isFavorite = false,
    idx,
}: NoteCardProps) {
    const noteUrl = id
        ? `/workspace?noteId=${id}`
        : (href ? href.replace(/^\/editor\?id=/, "/workspace?noteId=") : "/workspace");

    return (
        <Card className="w-[300px] h-[360px] relative" key={idx}>
            <CardHeader>
                <Image src="/note-img.png" alt="" width={300} height={200} />
            </CardHeader>
            <CardContent className="space-y-2">
                <CardTitle className="text-lg font-semibold line-clamp-1 flex items-center gap-1.5">
                    {isFavorite && (
                        <Star
                            className="size-4 shrink-0 fill-primary text-primary"
                            role="img"
                            aria-label="Nota favorita"
                        />
                    )}
                    <span className="truncate">{title}</span>
                </CardTitle>
                <p className="max-w-[300px] max-h-[75px] line-clamp-3">{description}</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 w-full absolute bottom-2 justify-center items-center">
                <Link href={noteUrl} className="w-full">
                    <Button className="w-full cursor-pointer">Acessar</Button>
                </Link>
                <p className="text-[14px]">Last update: {lastUpdateDate} at {lastUpdateTime}</p>    
            </CardFooter>
        </Card>
    )
}

