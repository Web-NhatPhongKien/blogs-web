const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    
    // Kiểm tra nếu state đã có dữ liệu và tổng số tài liệu trong cơ sở dữ liệu lớn hơn số lượng đang hiển thị
    if (state !== null && state.totalDocs > state.results.length) {
        return (
            <button 
                // Khi click, gọi hàm fetchDataFun và truyền vào tham số object chứa số trang tiếp theo
                onClick={() => fetchDataFun({ page: state.page + 1 })}
                className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
                Load More
            </button>
        );
    }

    // Nếu không thỏa mãn điều kiện (đã tải hết dữ liệu), component sẽ không render gì cả (ẩn nút)
    return null;
};

export default LoadMoreDataBtn;