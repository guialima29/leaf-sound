import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardAction
} from "@/components/ui/card"
import { X } from "lucide-react"

interface CardDeleteNoteProps {
    onCancel: () => void;
    onConfirm: () => void;
}

export function CardDeleteNote({ onCancel, onConfirm }: CardDeleteNoteProps) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-row items-start justify-center">
                <CardTitle className="text-lg font-semibold">Deletar Anotação</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <p className="text-center">
                        Tem certeza que deseja deletar esta anotação?<br /><br /> <b>Esta ação não pode ser desfeita.</b>
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                        <Button
                            onClick={onConfirm}
                            variant="destructive"
                            className="w-full"
                        >
                            Deletar Permanentemente
                        </Button>
                        <Button
                            onClick={onCancel}
                            className="w-full"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
