"use client"

import Header from "@/components/Header";
import TextEditor from "@/components/TextEditor";
import TitleWithBar from "@/components/TitleWithBar";
// import { useDebounce } from "@/hooks/useDebounce";
import { useDebounce } from "use-debounce";
import { useEffect, useState, useRef } from "react";
import type { OutputData } from "@editorjs/editorjs";

export default function Editor() {
    const [editorData, setEditorData] = useState<OutputData | undefined>();
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const lastSavedDataRef = useRef<string>("");

    const [debouncedData] = useDebounce(editorData, 5000, {
        leading: false,
        trailing: true
    });

    const handleChange = (data: OutputData) => {
        if (data.blocks && data.blocks.length > 0) {
            console.log("Editando...");
            setEditorData(data);
            setIsSaving(false);
        }
    }

    useEffect(() => {
        const saveData = async () => {
            if (!debouncedData || !debouncedData.blocks || debouncedData.blocks.length === 0) {
                return
            };

            const currentData = JSON.stringify(debouncedData);

            if (currentData === lastSavedDataRef.current) {
                console.log("Dados iguais, ignorando...")
                return
            };

            console.log("Salvando...", debouncedData);
            setIsSaving(true);

            await new Promise(resolve => setTimeout(resolve, 500))

            lastSavedDataRef.current = currentData
            setLastSaved(new Date())
            setIsSaving(true)

            console.log("✅ Salvo com sucesso!")
        };

        saveData()
    }, [debouncedData])

    const getTimeSinceLastSave = () => {
        if (!lastSaved) return ""

        const seconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000)

        if (seconds < 5) return "agora"
        if (seconds < 60) return `há ${seconds}s`

        const minutes = Math.floor(seconds / 60)
        return `há ${minutes}min`
    }

    return (
        <>
            <Header />
            <TitleWithBar title="Pop Chords" />
            <div className="flex items-center gap-2 text-sm">
                {isSaving ? (
                    <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">
                            Salvo {getTimeSinceLastSave()}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        <span className="text-gray-600">Editando...</span>
                    </>
                )}
            </div>
            <TextEditor onChange={handleChange} />
        </>
    )
}