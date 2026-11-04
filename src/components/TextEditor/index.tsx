"use client"

import { useEffect, useRef } from "react"
import type { OutputData } from "@editorjs/editorjs"
import "@/app/editor/editor-styles.css"

interface NoteEditorProps {
    initialData?: OutputData
    onChange?: (data: OutputData) => void
}

type EditorInstance = {
    save: () => Promise<OutputData>
    isReady?: Promise<void>
    destroy?: () => void
}

export default function TextEditor({ initialData, onChange }: NoteEditorProps) {
    const editorRef = useRef<EditorInstance | null>(null)

    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        // Evita criar o editor se o efeito foi limpo durante os imports assíncronos (Strict Mode)
        let cancelled = false

        const initEditor = async () => {
            const EditorJS = (await import("@editorjs/editorjs")).default
            const Header = (await import("@editorjs/header")).default
            const List = (await import("@editorjs/list")).default
            const Code = (await import("@editorjs/code")).default
            const Paragraph = (await import("@editorjs/paragraph")).default
            const LeafMusicPartituraTool = (await import("@/lib/editorjs/tools/LeafMusicPartituraTool")).default
            const LeafMusicAcordesTool = (await import("@/lib/editorjs/tools/LeafMusicAcordesTool")).default

            if (cancelled) return

            if (!editorRef.current) {
                const editor = new EditorJS({
                    holder: "editorjs",
                    tools: {
                        header: {
                            // @ts-expect-error Editor.js tool class vs ESM default export
                            class: Header,
                            inlineToolbar: true,
                            config: {
                                placeholder: "Digite um título...",
                                levels: [2],
                                defaultLevel: 2
                            }
                        },
                        paragraph: {
                            // @ts-expect-error Editor.js tool class vs ESM default export
                            class: Paragraph,
                            inlineToolbar: true,
                            config: {
                                placeholder: "Digite seu texto..."
                            }
                        },
                        list: {
                            class: List,
                            inlineToolbar: true,
                        },
                        code: {
                            class: Code,
                        },
                        leafMusic_partitura: {
                            class: LeafMusicPartituraTool,
                        },
                        leafMusic_acordes: {
                            class: LeafMusicAcordesTool,
                        },
                    },
                    data: initialData,
                    onChange: async () => {
                        if (onChangeRef.current && editorRef.current) {
                            const data = await editorRef.current.save()
                            onChangeRef.current(data)
                        }
                    },
                    placeholder: "Comece a escrever sua nota..."
                })
                editorRef.current = editor
            }
        }

        initEditor()

        return () => {
            cancelled = true
            const editor = editorRef.current
            editorRef.current = null
            if (!editor) return
            if (editor.destroy) {
                editor.destroy()
            } else if (editor.isReady) {
                // destroy só existe depois de isReady; destruir assim que o editor terminar de iniciar
                editor.isReady.then(() => editor.destroy?.()).catch(() => {})
            }
        }
        // initialData aplicado só na criação; evitar re-init completo a cada mudança
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once editor; idem padrão anterior
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div
                id="editorjs"
                className="min-h-[500px] border rounded-lg p-6 overflow-hidden
                   prose prose-slate prose-lg max-w-none
                   prose-headings:font-bold
                   prose-h1:text-4xl prose-h1:mb-4
                   prose-h2:text-3xl prose-h2:mb-3
                   prose-h3:text-2xl prose-h3:mb-2
                   prose-p:text-base prose-p:leading-7"
            />
        </div>
    )
}