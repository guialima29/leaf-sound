import Image from "next/image"
import { ClerkProvider, SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton } from "@clerk/nextjs";

export default function LoginArea() {
    return (
        <ClerkProvider>
        <div className="flex items-center justify-center flex-col gap-4">
            <div className="flex flex-row items-center justify-center gap-4 mt-20">
                <Image src={'/lf-logo.svg'} alt="LeafSound" width={45} height={100}/>
                <h1 className="font-bold font-libre-caslon text-[56px] text-[#2B3328]">Login</h1>
            </div>
            <div>
                <SignedOut>
                    <SignInButton/>
                    <SignUpButton/>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </div>
            <p>Não tem uma conta?<span className="text-[#5DAA3B]"> Registre-se agora</span></p>
        </div>
        </ClerkProvider>
    )
}