"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { storage } from "@/lib/storage";
import NoteCard from "./NoteCard";
import Spinner from "./Spinner";
import NotesPagination from "./NotesPagination";
import CreateNoteCard from "./CardCreateNote";
import { CardNewNote } from "./CardNewNote";

export default function PaginationDemo() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const itemsPerPage = 12;

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['notes'],
		queryFn: async () => {
			const notes = storage.getNotes();
			return notes.sort((a, b) => b.updatedAt - a.updatedAt);
		}
	})

	useEffect(() => {
		if (!isModalOpen) {
			refetch();
		}
	}, [isModalOpen, refetch]);

	const index_inicial = (currentPage - 1) * itemsPerPage;
	const index_final = index_inicial + (itemsPerPage - 1);

	const notasAtual = data?.slice(index_inicial, index_final) || [];

	const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

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

			<div className="flex gap-4 justify-center mt-8">
				<NotesPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
					<CardNewNote onClick={() => setIsModalOpen(false)} />
				</div>
			)

			}
		</div>
	)
}