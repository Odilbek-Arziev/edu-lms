import React from "react";
import {Pagination, PaginationItem, PaginationLink} from "reactstrap";

interface PaginationButtonsProps {
    count: number;
    currentPage: number;
    perPageData: number;
    setCurrentPage: (page: number) => void;
    siblingCount?: number;
}

const DOTS = "...";

const range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({length}, (_, i) => start + i);
};

const PaginationButtons = ({
                               count,
                               currentPage,
                               perPageData,
                               setCurrentPage,
                               siblingCount = 1,
                           }: PaginationButtonsProps) => {
    const totalPages = Math.ceil(count / perPageData);

    const paginationRange = React.useMemo<(number | string)[]>(() => {
        const totalPageNumbers = siblingCount * 2 + 5;

        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSibling = Math.max(currentPage - siblingCount, 1);
        const rightSibling = Math.min(currentPage + siblingCount, totalPages);

        const showLeftDots = leftSibling > 2;
        const showRightDots = rightSibling < totalPages - 1;

        const firstPage = 1;
        const lastPage = totalPages;

        if (!showLeftDots && showRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            return [...range(1, leftItemCount), DOTS, lastPage];
        }

        if (showLeftDots && !showRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            return [firstPage, DOTS, ...range(totalPages - rightItemCount + 1, totalPages)];
        }

        return [firstPage, DOTS, ...range(leftSibling, rightSibling), DOTS, lastPage];
    }, [count, currentPage, perPageData, siblingCount, totalPages]);

    if (totalPages <= 1) return null;

    const goTo = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
    };

    return (
        <Pagination className="justify-content-center my-3" listClassName="mb-0">
            <PaginationItem disabled={currentPage === 1}>
                <PaginationLink previous onClick={() => goTo(currentPage - 1)}/>
            </PaginationItem>

            {paginationRange.map((p, idx) => {
                if (p === DOTS) {
                    return (
                        <PaginationItem key={`dots-${idx}`} disabled>
                            <PaginationLink>…</PaginationLink>
                        </PaginationItem>
                    );
                }
                return (
                    <PaginationItem key={p} active={p === currentPage}>
                        <PaginationLink onClick={() => goTo(p as number)}>{p}</PaginationLink>
                    </PaginationItem>
                );
            })}

            <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink next onClick={() => goTo(currentPage + 1)}/>
            </PaginationItem>
        </Pagination>
    );
};

export default PaginationButtons;