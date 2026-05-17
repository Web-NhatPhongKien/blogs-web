const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    
    // Kiểm tra nếu state đã có dữ liệu và tổng số tài liệu trong cơ sở dữ liệu lớn hơn số lượng đang hiển thị
    if (state !== null && state.totalDocs > state.results.length) {
        return (
            <button onClick={() => fetchDataFun({ page: state.page + 1 })} className="load-more-btn">
                Load More
            </button>
        );
    }

    return null;
};

export default LoadMoreDataBtn;