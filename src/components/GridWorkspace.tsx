import NoteCard from "./NoteCard";
import { componentsNotes } from "@/constants/constNoteCards";

interface ComponentNote {
    title: string;
    description: string;
    lastUpdateDate: string;
    lastUpdateTime: string;
    href: string;
}

export default function GridWorkspace() {
    return(
        <div className="grid grid-cols-4 gap-20 p-4 content-center">
            {componentsNotes.map((component, index) => (
                <NoteCard title={component.title} description={component.description} lastUpdateDate={component.lastUpdateDate} lastUpdateTime={component.lastUpdateTime} href={component.href} idx={index}/>
            ))}
            
        </div>
    )
}