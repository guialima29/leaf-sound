import GridWorkspace from "./GridWorkspace";
import TitleWithBar from "./TitleWithBar";
import PaginationDemo from "@/components/Pagination";

export default function WorkspaceMenu() {
    return(
        <>
            <TitleWithBar title="User's Workspace"/>
            <div className="flex flex-col justify-center items-center">
                {/* <GridWorkspace/> */}
                <PaginationDemo />
            </div>
        </>
    )
}