import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerBadge({ isSaving }: { isSaving: boolean }) {
    return (
        <div className="flex items-center justify-center gap-4 mb-8 [--radius:1.2rem]">
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
    )
}