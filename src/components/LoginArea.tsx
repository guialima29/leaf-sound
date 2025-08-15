import Image from "next/image"
import { LoginWithGoogle } from "@/hooks/googleSignIn";
import Link from "next/link";

export default function LoginArea() {
    return (
        <div className="flex items-center justify-center flex-col gap-6">
            <div className="flex flex-row items-center justify-center gap-4 mt-20">
                <Image src={'/lf-logo.svg'} alt="LeafSound" width={45} height={100}/>
                <h1 className="font-bold font-libre-caslon text-[56px] text-[#2B3328]">Login</h1>
            </div>
            <div>n
                <LoginWithGoogle/>
            </div>
            <p>Não tem uma conta?<Link href="/register" className="text-[#5DAA3B]"> Registre-se agora</Link></p>
        </div>
    )
}