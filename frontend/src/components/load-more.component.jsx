const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    if (state !== null && state.totalDocs > state.results.length) {
        return (
            <button onClick={() => fetchDataFun({ page: state.page + 1 })} className="load-more-btn">
                Xem thêm
            </button>
        );
    }

    return null;
};

export default LoadMoreDataBtn;