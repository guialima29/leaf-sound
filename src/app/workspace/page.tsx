import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header"
import PaginationDemo from "@/components/Pagination";
import TitleWithBar from "@/components/TitleWithBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function WorkspacePage() {
    return (
        <>
            {/* <Header/> */}
            <SidebarProvider>
                <AppSidebar/>
                    <div>
                        <TitleWithBar title="User's Workspace"/>
                        <div className="flex flex-col justify-center items-center">
                            <PaginationDemo />
                        </div>
                    </div>
            </SidebarProvider>
        </>
    );
}