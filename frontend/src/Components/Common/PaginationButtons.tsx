import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import {Row} from "reactstrap";

interface PaginationProps {
    count: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    perPageData: number;
}

const PaginationButtons = ({
   count,
   currentPage,
   setCurrentPage,
   perPageData,
}: PaginationProps) => {

    const totalPages = Math.ceil(count / perPageData);

    const pageNumbers = useMemo(() => {
        return Array.from({length: totalPages}, (_, i) => i + 1);
    }, [totalPages]);

    if (totalPages <= 1) return null;

    return (
        <Row className="g-0 justify-content-start my-4">
            <div className="col">
                <ul className="pagination-block pagination pagination-separated mb-sm-0">

                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <Link
                            to="#!"
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </Link>
                    </li>

                    {pageNumbers.map((page) => (
                        <li key={page} className="page-item">
                            <Link
                                to="#!"
                                className={`page-link ${page === currentPage ? "active" : ""}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Link>
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <Link
                            to="#!"
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </Link>
                    </li>

                </ul>
            </div>
        </Row>
    );
};

export default PaginationButtons;
