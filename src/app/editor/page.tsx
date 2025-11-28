"use client"

import Header from "@/components/Header";
import TextEditor from "@/components/TextEditor";
import TitleWithBar from "@/components/TitleWithBar";

export default function Editor() {
    const handleChange = (data: any) => {
        console.log("Data change: ", data)
    }
    return (
        <>
            <Header />
            <TitleWithBar title="Pop Chords" />
            <TextEditor onChange={handleChange} />
        </>
    )
}