"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NoteCard from "../NoteCard";
import Spinner from "../Spinner";
import NotesPagination from "../NotesPagination";
import EmptyNotes from "../EmptyNotes";
import { useWorkspace } from "@/contexts/workspace-context";

export default function PaginationDemo() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;
	const router = useRouter();
	const { notes, isLoading, createNote } = useWorkspace();

	// Notas da workspace ativa (o contexto já filtra): favoritas primeiro, depois mais recentes
	const allNotes = useMemo(
		() =>
			[...notes].sort(
				(a, b) =>
					Number(!!b.isFavorite) - Number(!!a.isFavorite) || b.updatedAt - a.updatedAt
			),
		[notes]
	);

	const handleCreateNote = async () => {
		try {
			const newNote = await createNote("Nova Nota");
			router.push(`/workspace?noteId=${newNote.id}`, { scroll: false });
		} catch (err) {
			console.error("Erro ao criar nota:", err);
		}
	};

	if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center gap-4 py-16">
                <p className="text-muted-foreground">Carregando notas...</p>
                <Spinner className="size-6 text-primary" />
            </div>
        );
    }

    const totalPages = Math.ceil(allNotes.length / itemsPerPage);
    // Se notas forem excluídas, a página atual pode deixar de existir
    const page = Math.min(currentPage, Math.max(totalPages, 1));
    const index_inicial = (page - 1) * itemsPerPage;
    const index_final = index_inicial + itemsPerPage;

    const notasAtual = allNotes.slice(index_inicial, index_final);

	return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>

            {allNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-12">
                    <EmptyNotes onCreateNote={handleCreateNote}/>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {notasAtual.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                id={note.id}
                                idx={index}
                                title={note.title}
                                description={note.description ?? ""}
                                lastUpdateDate={note.lastUpdateDate}
                                lastUpdateTime={note.lastUpdateTime}
                                href={`/workspace?noteId=${note.id}`}
                                isFavorite={!!note.isFavorite}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex gap-4 justify-center mt-8">
                            <NotesPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
