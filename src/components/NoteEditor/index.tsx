import { useRef, useEffect } from "react";

interface NoteEditorProps {
    initialDate?: any,
    onChange?: (data: any) => void;
}

export function NoteEditor({ initialDate, onChange }: NoteEditorProps) {
    const editorRef = useRef<any>(null);

    useEffect(() => {
        console.log("Editor montado")

        return () => {
            console.log("Editor desmontado")
        }
    }, []);
    
    return (
        <div>
            <div id="editorjs" className="prose max-w-full"></div>
        </div>
    )
}