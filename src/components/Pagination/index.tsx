"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { storage } from "@/lib/storage";
import NoteCard from "../NoteCard";
import Spinner from "../Spinner";
import NotesPagination from "../NotesPagination";
import CreateNoteCard from "../CardCreateNote";
import { CardNewNote } from "../CardNewNote";
import EmptyNotes from "../EmptyNotes";
import { useWorkspace } from "@/contexts/workspace-context";

export default function PaginationDemo() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const itemsPerPage = 12;
	const { activeWorkspace, refresh: refreshWorkspace } = useWorkspace();

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['notes', activeWorkspace?.id],
		queryFn: async () => {
			if (typeof window === 'undefined') return [];
			const notes = storage.getNotes();
			if (!activeWorkspace) return notes;
			return notes
				.filter((n) => !n.workspaceId || n.workspaceId === activeWorkspace.id)
				.sort((a, b) => b.updatedAt - a.updatedAt);
		}
	})

	const prevModalState = useRef(isModalOpen);
	useEffect(() => {
        if (prevModalState.current && !isModalOpen) {
            refetch();
            refreshWorkspace();
        }
        prevModalState.current = isModalOpen;
    }, [isModalOpen, refetch, refreshWorkspace]);

	if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>
                <p>Carregando notas...</p>
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>
                <p className="text-red-500">Erro ao carregar as notas!</p>
            </div>
        );
    }

	const allNotes = data || [];
    const index_inicial = (currentPage - 1) * itemsPerPage;
    const index_final = index_inicial + itemsPerPage; // Correção do limite do slice

    const notasAtual = allNotes.slice(index_inicial, index_final);
    const totalPages = Math.ceil(allNotes.length / itemsPerPage);

	if (isLoading) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>
				<p>Carregando notas...</p>
				<Spinner />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>
				<p className="text-red-500">Erro ao carregar as notas!</p>
			</div>
		)
	}

	return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>

            {allNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-12">
                    <EmptyNotes onCreateNote={() => setIsModalOpen(true)}/>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CreateNoteCard onClick={() => setIsModalOpen(true)} />
                        {notasAtual.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                idx={index}
                                title={note.title}
                                description={note.description}
                                lastUpdateDate={note.lastUpdateDate}
                                lastUpdateTime={note.lastUpdateTime}
                                href={note.href}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex gap-4 justify-center mt-8">
                            <NotesPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <CardNewNote onClick={() => setIsModalOpen(false)} />
                </div>
            )}
        </div>
    );
}