export default function TitleWithBar({title}:{title:string}) {
    return(
        <>
            <div className="flex justify-center">
                <h1 className="text-[36px] font-libre-caslon font-semibold text-[#2B3328]">{title}</h1>
            </div>
            <hr className="w-64 h-1 mx-auto my-4 bg-gray-300 border-0 rounded-sm md:my-10 dark:bg-gray-700"/>
        </>
    )
}