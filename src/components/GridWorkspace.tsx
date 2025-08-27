import NoteCard from "./NoteCard";

export default function GridWorkspace() {
    return(
        <div className="grid grid-cols-4 gap-20 p-4 content-center">
            <NoteCard></NoteCard>
        </div>
    )
}