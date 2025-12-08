"use client"

import EditorHeader from "@/components/EditorHeader";
import TextEditor from "@/components/TextEditor";
import TitleWithBar from "@/components/TitleWithBar";
import { useDebounce } from "use-debounce";
import { useEffect, useState, useRef, Suspense } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { SpinnerBadge } from "@/components/Items/Spinner";
import { useSearchParams } from "next/navigation";
import { storage } from "@/lib/storage";

function EditorContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [editorData, setEditorData] = useState<OutputData | undefined>();
    const [noteTitle, setNoteTitle] = useState("Nova Nota");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [debouncedData] = useDebounce(editorData, 5000, {
        leading: false,
        trailing: true
    });

    useEffect(() => {
        if (id) {
            const note = storage.getNote(id);
            if (note) {
                if (note.content) {
                    setEditorData(note.content);
                }
                setNoteTitle(note.title);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleChange = (data: OutputData) => {
        if (data.blocks && data.blocks.length > 0) {
            console.log("Editando...");
            setEditorData(data);
            setIsSaving(true);
        }
    }

    useEffect(() => {
        const saveData = async () => {
            if (!debouncedData || !debouncedData.blocks || debouncedData.blocks.length === 0) {
                return
            };

            if (!id) return;

            console.log("Salvando...", debouncedData);
            setIsSaving(true);

            try {
                storage.saveNote({
                    id,
                    content: debouncedData,
                    description: debouncedData.blocks.find(b => b.type === 'paragraph')?.data.text.slice(0, 100) || "Sem descrição"
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                setLastSaved(new Date());
                setIsSaving(false);
                console.log("✅ Salvo com sucesso!");
            } catch (error) {
                console.error("Erro ao salvar", error);
                setIsSaving(false);
            }
        };

        saveData();
    }, [debouncedData, id]);

    if (isLoading) {
        return <div className="flex justify-center p-10">Carregando...</div>;
    }

    return (
        <>
            <EditorHeader />
            <TitleWithBar title={noteTitle} />
            <SpinnerBadge isSaving={isSaving} />
            <div className="bg-white min-h-screen">
                <TextEditor initialData={editorData} onChange={handleChange} />
            </div>
        </>
    )
}

export default function Editor() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditorContent />
        </Suspense>
    )
}