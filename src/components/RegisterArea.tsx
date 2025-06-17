import Image from "next/image"
import { ClerkProvider } from "@clerk/nextjs";
import { RegisterWithGoogle } from "@/hooks/googleSignUp";
import Link from "next/link";

export default function LoginArea() {
    return (
        <ClerkProvider>
        <div className="flex items-center justify-center flex-col gap-6">
            <div className="flex flex-row items-center justify-center gap-4 mt-20">
                <Image src={'/lf-logo.svg'} alt="LeafSound" width={45} height={100}/>
                <h1 className="font-bold font-libre-caslon text-[56px] text-[#2B3328]">Registrar-se</h1>
            </div>
            <div>
                <RegisterWithGoogle/>
            </div>
            <p>Já tem uma conta?<Link href="/login" className="text-[#5DAA3B]"> Logue agora</Link></p>
        </div>
        </ClerkProvider>
    )
}