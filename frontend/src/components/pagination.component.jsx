const Pagination = ({ state, fetchDataFun }) => {
    if (!state || state.totalPages <= 1) {
        return null;
    }

    const { page, totalPages } = state;

    const getPageNumbers = () => {
        const pages = new Set([1, totalPages]);

        for (let i = page - 1; i <= page + 1; i++) {
            if (i > 1 && i < totalPages) {
                pages.add(i);
            }
        }

        return [...pages].sort((a, b) => a - b);
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            <button
                type="button"
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => fetchDataFun({ page: page - 1 })}
            >
                Prev
            </button>

            {pageNumbers.map((pageNumber, i) => {
                const previousPage = pageNumbers[i - 1];
                const showGap = previousPage && pageNumber - previousPage > 1;

                return (
                    <span key={pageNumber} className="pagination-item">
                        {showGap ? <span className="pagination-gap">...</span> : null}
                        <button
                            type="button"
                            className={`pagination-btn ${page === pageNumber ? "active" : ""}`}
                            onClick={() => fetchDataFun({ page: pageNumber })}
                        >
                            {pageNumber}
                        </button>
                    </span>
                );
            })}

            <button
                type="button"
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => fetchDataFun({ page: page + 1 })}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
