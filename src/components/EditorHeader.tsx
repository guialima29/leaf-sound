"use client"

import Image from "next/image"
import NavButton from "./NavButton"
import { Button } from "./ui/button"
import Link from "next/link"
import { Home, ArrowBigLeft, Trash2 } from "lucide-react"
import { useState } from "react"
import { CardDeleteNote } from "./CardDeleteNote"
import { useSearchParams, useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

export default function Header() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const handleDelete = () => {
        if (id) {
            storage.deleteNote(id);
            router.push('/workspace');
        }
    }

    return (
        <div className="flex-row flex justify-between items-center max-w-full px-4 py-2 mt-1 relative">
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <CardDeleteNote
                        onCancel={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                    />
                </div>
            )}

            <div className="flex items-center space-x-2">
                <Button variant="ghost" className="flex items-center gap-2" asChild>
                    <Link href="/workspace">
                        <ArrowBigLeft className="size-7 stroke-2.5" />
                        <span className="text-2xl">Workspace</span>
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 bg-red-500 text-white hover:bg-red-600 hover:text-white hover:scale-110 transition-all ml-2"
                    onClick={() => setIsDeleteModalOpen(true)}
                    title="Deletar anotação"
                >
                    <Trash2 className="size-6 stroke-2" />
                </Button>
            </div>
            <div className=" items-center space-x-4 flex justify-self-end">
                <Image src={'./lf-logo.svg'} alt="LeafSound" width={64} height={64} className="" style={{ width: "auto", height: "auto" }} />
                <span className="text-2xl">LeafSound</span>
            </div>
        </div>
    )
}