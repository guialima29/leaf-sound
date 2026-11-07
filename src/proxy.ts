import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Nenhuma rota está protegida ainda. Sem a chave do Clerk, o clerkMiddleware() lança erro
// e todas as rotas respondem 500 no `next start`; por isso, sem a chave, a requisição passa direto.
// TODO: a tarefa de autenticação deve tornar a chave obrigatória (remover este fallback).
const proxy = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? clerkMiddleware()
  : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
