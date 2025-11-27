"use client"

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';

interface NoteEditorProps {
    initialData?: any
    onChange?: (data: any) => void
}

export function TextEditor({ initialData, onChange }: NoteEditorProps) {
    const editorRef = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: 'editor',
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: "Digite um título...",
                            levels: [1, 2, 3, 4, 5, 6],
                            defaultLevel: 1
                        }
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    code: {
                        class: Code,
                        inlineToolbar: true,
                        config: {
                            placeholder: "print('Hello World')"
                        }
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                        config: {
                            placeholder: "Digite seu texto..."
                        }
                    }
                },

                data: initialData,

                onChange: async () => {
                    if (onChange && editorRef.current) {
                        const data = await editorRef.current.save()
                        onChange(data)
                    }
                },

                placeholder: "Comece a escrever sua nota..."
            })

            editorRef.current = editor
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }

    }, [])
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div
                id="editorjs"
                className="prose prose-lg max-w-none min-h-[500px] border rounded-lg p-6"
            />
        </div>
    )
}