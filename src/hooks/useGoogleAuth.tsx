"use client";
import { useSignIn, useSignUp } from "@clerk/nextjs";

export default function useGoogleAuth() {
    const { signUp } = useSignUp();
    const { signIn } = useSignIn();

    const handleGoogleSignUp = async () => {
        signUp?.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/workspace",
            redirectUrlComplete: "/workspace",
        });
    };

    const handleGoogleSignIn = async () => {
        signIn?.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/workspace",
            redirectUrlComplete: "/workspace",
        });
    };

    return { handleGoogleSignUp, handleGoogleSignIn };
};