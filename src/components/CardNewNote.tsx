import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputGroup,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TextareaAutosize from "react-textarea-autosize"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { storage } from "@/lib/storage"
import { X } from "lucide-react"

interface CardNewNoteProp {
    onClick: () => void;
}

export function CardNewNote({ onClick }: CardNewNoteProp) {
    const MAX_TITLE = 30;
    const MAX_DESCRIPTION = 100;
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const newNote = storage.createNote(title, description);
        router.push(`/editor?id=${newNote.id}`);
    }

    return (
        <Card className="w-full max-w-sm ">
            <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-lg font-semibold">Criar Anotação</CardTitle>
                <CardAction className="-mt-1">
                    <Button
                        onClick={onClick}
                        variant="link"
                        className="bg-black text-white w-7 h-7 hover:scale-110 transition-all"
                    >
                        <X className="w-4 h-4 rounded-full stroke-4" />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nome-nota">Nome</Label>
                            <Input
                                id="nome-nota"
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={MAX_TITLE}
                            />
                        </div>
                    </div>
                    <div className="flex-col gap-1 mt-5" >
                        <Button type="submit" className="w-full">
                            Criar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
