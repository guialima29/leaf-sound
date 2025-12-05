"use client"

import Header from "@/components/Header";
import TextEditor from "@/components/TextEditor";
import TitleWithBar from "@/components/TitleWithBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";

export default function Editor() {
    const [editorData, setEditorData] = useState<OutputData | undefined>()
    const debouncedData = useDebounce(editorData, 5000)

    const handleChange = (data: any) => {
        console.log("Data change: ", data)
        setEditorData(data)
    }

    useEffect(() => {
        if (debouncedData) {
            console.log("Debounced data: ", debouncedData)
        }
    }, [debouncedData])
    return (
        <>
            <Header />
            <TitleWithBar title="Pop Chords" />
            <div className="text-sm text-gray-500">
                {debouncedData ? "✅ Salvo" : "✏️ Editando..."}
            </div>
            <TextEditor onChange={handleChange} />
        </>
    )
}