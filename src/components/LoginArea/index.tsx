import Image from "next/image"
import Link from "next/link";

export default function LoginArea() {
    return (
        <div className="flex items-center justify-center flex-col min-h-screen">
            <div className="gap-10 flex items-center flex-col justify-center mb-20">
                <div className="flex flex-row items-center justify-center gap-4">
                    <Image src={'/lf-logo.svg'} alt="LeafSound" width={45} height={100} />
                    <h1 className="font-bold font-libre-caslon text-[56px] text-[#2B3328]">Faça seu Login</h1>
                </div>
                <div>
                    <button
                        className="flex items-center justify-center gap-4 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
                    >
                        <Image src="/google-icon.svg" width="48" height={48} alt="Google Icon" className="w-5 h-5" />
                        <Link href="/workspace">Login com o Google</Link>
                    </button>
                </div>
            </div>
            <footer className="fixed bottom-0 mb-10">
                <p className="text-sm flex items-center justify-center"><i>Caso for seu primeiro acesso, será criado automaticamente uma nova conta</i></p>
            </footer>
        </div>
    )
}