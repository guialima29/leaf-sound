import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "../ui/button"
import { X } from "lucide-react"

interface EmptyNotesProps {
    onCreateNote?: () => void;
}

export default function EmptyNotes({onCreateNote}: EmptyNotesProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <X />
                </EmptyMedia>
                <EmptyTitle>Procuramos mas não achamos!</EmptyTitle>
                <EmptyDescription>Não há anotações dentro dessa workspace.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={onCreateNote} className="hover:scale-102">Criar Anotação</Button>
            </EmptyContent>
        </Empty>
    )
}