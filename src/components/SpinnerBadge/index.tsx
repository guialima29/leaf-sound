import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function SpinnerBadge({
    isSaving,
    lastSaved,
    hasError = false,
    onRetry,
    className,
}: {
    isSaving: boolean
    lastSaved?: Date | null
    /** Falha ao salvar: o conteúdo continua pendente e será reenviado na próxima tentativa. */
    hasError?: boolean
    /** Quando informado, o estado de erro vira um botão "Tentar novamente". */
    onRetry?: () => void
    className?: string
}) {
    const showError = hasError && !isSaving

    return (
        <div className={cn("flex flex-col items-center justify-center gap-1 mb-8 [--radius:1.2rem]", className)}>
            <div className="flex items-center justify-center gap-4">
                {isSaving ? (
                    <Badge variant="secondary">
                        <Spinner />
                        Editando...
                    </Badge>
                ) : showError ? (
                    <Badge variant="destructive" asChild={!!onRetry}>
                        {onRetry ? (
                            <button type="button" onClick={onRetry} title="Tentar salvar novamente" className="cursor-pointer">
                                <AlertTriangle />
                                Erro ao salvar
                                <span className="underline">Tentar novamente</span>
                            </button>
                        ) : (
                            <>
                                <AlertTriangle />
                                Erro ao salvar
                            </>
                        )}
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
