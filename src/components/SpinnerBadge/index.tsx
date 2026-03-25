import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerBadge({
    isSaving,
    lastSaved,
}: {
    isSaving: boolean
    lastSaved?: Date | null
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-1 mb-8 [--radius:1.2rem]">
            <div className="flex items-center justify-center gap-4">
                {isSaving ? (
                    <Badge variant="secondary">
                        <Spinner />
                        Editando...
                    </Badge>
                ) : (
                    <Badge variant="secondary">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Salvo!
                    </Badge>
                )}
            </div>
            {lastSaved ? (
                <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                    Último salvamento: {lastSaved.toLocaleString("pt-BR")}
                </span>
            ) : null}
        </div>
    )
}