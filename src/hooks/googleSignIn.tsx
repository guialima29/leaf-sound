"use client";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";

export function LoginWithGoogle() {
    const { signIn } = useSignIn();

    const handleGoogleSignIn = async () => {
        signIn?.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/workspace",
            redirectUrlComplete: "/workspace",
        });
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
        >
            <Image src="/google-icon.svg"  width="48" height={48} alt="Google Icon" className="w-5 h-5" />
            Login com o Google
        </button>
    );


}