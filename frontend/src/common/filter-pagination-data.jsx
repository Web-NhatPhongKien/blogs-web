export const filterPaginationData = ({ data, page, totalDocs, totalPages, limit }) => {
    return {
        results: data,
        page,
        totalDocs,
        totalPages,
        limit
    };
};
