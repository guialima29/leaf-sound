import { useEffect } from "react";

export function NoteEditor() {
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
