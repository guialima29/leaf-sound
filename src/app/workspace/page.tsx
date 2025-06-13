import { ClerkProvider } from "@clerk/nextjs";

export default function WorkspacePage() {
    return (
        <ClerkProvider>
        <div className="flex flex-col gap-35 w-full">
            <h1 className="text-2xl font-bold">Workspace Page</h1>
            <p>This is the workspace page content.</p>
            {/* Add your workspace components here */}
        </div>
        </ClerkProvider>
    );
}