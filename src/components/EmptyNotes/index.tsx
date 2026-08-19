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

export default function EmptyNotes() {
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
                <Button className="bg-[#5DAA3B] hover:bg-[#43563B] hover:scale-102">Criar Anotação</Button>
            </EmptyContent>
        </Empty>
    )
}