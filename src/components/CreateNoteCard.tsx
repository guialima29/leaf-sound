import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

interface CreateNoteCardProps {
    onClick?: () => void;
}

export default function CreateNoteCard({ onClick }: CreateNoteCardProps) {
    return (
        <Card className="w-[300px] h-[360px] relative cursor-pointer hover:bg-slate-50 transition-colors" onClick={onClick}>
            <CardContent className="space-y-2 pt-10">
                <div className="flex items-center justify-center h-full">
                    <Image className="flex items-center justify-center opacity-50" src="/plus-icon.png" alt="" width={100} height={100} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 w-full absolute bottom-10 justify-center items-center ">
                <CardTitle className="font-semibold line-clamp-1 text-center text-[24px]">Nova Anotação</CardTitle>
            </CardFooter>
        </Card>
    )
}