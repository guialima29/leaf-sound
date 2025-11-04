import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"

interface NotesPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void
}

function generatePageNumbers(currentPage: number, totalPages: number) {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    console.log('=== DEBUG ===')
    console.log('currentPage:', currentPage)
    console.log('totalPages:', totalPages)

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i < totalPages; i++) {
            pages.push(i)
        }
    } else {
        pages.push(1)

        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);

        console.log('startPage:', startPage)
        console.log('endPage:', endPage)


        if (startPage > 2) {
            pages.push('ellipsis-start');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        console.log('Antes do ellipsis-end, endPage:', endPage, 'totalPages-1:', totalPages - 1)
        if (endPage < totalPages - 1) {
            pages.push('ellipsis-end');
        }

        console.log('Array final:', pages)
        console.log('=============')

        pages.push(totalPages);
    }

    return pages;
}

export default function NotesPagination({
    currentPage,
    totalPages,
    onPageChange }: NotesPaginationProps) {
        const pages = generatePageNumbers(currentPage, totalPages)
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(currentPage - 1)}
                        aria-disabled={currentPage == 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>


                {pages.map((page, index) => {
                    if (typeof page == 'string') {
                        return (
                            <PaginationItem key={page}>
                                <PaginationEllipsis/>
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                            onClick={() => onPageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            onClick={() => onPageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))} */}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(currentPage + 1)}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent >
        </Pagination >
    )
}