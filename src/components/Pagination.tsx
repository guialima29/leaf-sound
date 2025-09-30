"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import response from '@/constants/notesDemo.json'
import NoteCard from "./NoteCard"
import { useState } from "react"

export default function PaginationDemo() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const index_inicial = (currentPage - 1) * itemsPerPage;
	const index_final = index_inicial + (itemsPerPage - 1);

	const notasAtual = response.data.slice(index_inicial, index_final);

	const totalPages = Math.ceil(response.data.length / itemsPerPage);

	return (
		<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>
      
      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      {/* Botões temporários de navegação */}
      <div className="flex gap-4 justify-center mt-8">
        <button 
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Anterior
        </button>
        
        <span className="px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>
        
        <button 
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}