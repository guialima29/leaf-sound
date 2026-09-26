"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";

function EditorRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || searchParams.get("noteId");

  useEffect(() => {
    if (id) {
      router.replace(`/workspace?noteId=${id}`);
    } else {
      router.replace("/workspace");
    }
  }, [id, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm text-muted-foreground">Redirecionando para o workspace...</p>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <EditorRedirect />
    </Suspense>
  );
}
