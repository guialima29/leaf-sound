
import type { OutputData } from "@editorjs/editorjs";

const STORAGE_KEY = 'leaf-sound-notes';

export interface Note {
    id: string;
    title: string;
    description: string;
    content?: OutputData;
    lastUpdateDate: string; // e.g. "08/12/2025"
    lastUpdateTime: string; // e.g. "13:30"
    createdAt: number;
    updatedAt: number;
    href: string; // legacy support for component prop
}

export const storage = {
    getNotes: (): Note[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse notes', e);
            return [];
        }
    },

    getNote: (id: string): Note | undefined => {
        const notes = storage.getNotes();
        return notes.find(n => n.id === id);
    },

    saveNote: (updatedNote: Partial<Note> & { id: string }): Note => {
        const notes = storage.getNotes();
        const index = notes.findIndex(n => n.id === updatedNote.id);

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        if (index >= 0) {
            const existing = notes[index];
            const merged: Note = {
                ...existing,
                ...updatedNote,
                updatedAt: Date.now(),
                lastUpdateDate: dateStr,
                lastUpdateTime: timeStr,
            };
            notes[index] = merged;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            return merged;
        } else {
            // Should usually use createNote, but if saving a new note ID directly:
            throw new Error("Note not found to save");
        }
    },

    createNote: (title: string, description: string): Note => {
        const notes = storage.getNotes();
        const now = new Date();
        const id = crypto.randomUUID();

        const newNote: Note = {
            id,
            title,
            description,
            content: undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastUpdateDate: now.toLocaleDateString('pt-BR'),
            lastUpdateTime: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            href: `/editor?id=${id}`
        };

        notes.unshift(newNote); // Add to beginning
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        return newNote;
    },

    deleteNote: (id: string) => {
        const notes = storage.getNotes().filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
};
