import Image from "next/image"
import Link from "next/link";

export default function LoginArea() {
    return (
            <div className="flex items-center justify-center flex-col gap-6">
                <div className="flex flex-row items-center justify-center gap-4 mt-20">
                    <Image src={'/lf-logo.svg'} alt="LeafSound" width={45} height={100} />
                    <h1 className="font-bold font-libre-caslon text-[56px] text-[#2B3328]">Registrar-se</h1>
                </div>
                <div>
                    <button
                        className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
                    >
                        <Image src="/google-icon.svg" width="48" height={48} alt="Google Icon" className="w-5 h-5" />
                        <Link href="/workspace">Login com o Google</Link>
                    </button>
                </div>
                <p>Já tem uma conta?<Link href="/login" className="text-[#5DAA3B]"> Logue agora</Link></p>
            </div>
    )
}