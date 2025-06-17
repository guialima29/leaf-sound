"use client";
import { useSignUp } from "@clerk/nextjs";
import Image from "next/image";

export function RegisterWithGoogle() {
    const { signUp } = useSignUp();

    const handleGoogleSignUp = async () => {
        signUp?.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/workspace",
            redirectUrlComplete: "/workspace",
        });
    };

    return (
        <button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
        >
            <Image src="/google-icon.svg"  width="48" height={48} alt="Google Icon" className="w-5 h-5" />
            Registro com o Google
        </button>
    );


}