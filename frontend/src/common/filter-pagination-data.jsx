import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {} }) => {
    let obj;

    // Kiểm tra xem đã có dữ liệu trước đó (state không null) và không có yêu cầu tạo mảng mới
    if (state !== null && !create_new_arr) {
        // Nối mảng dữ liệu mới vào cuối mảng dữ liệu cũ (state.results) và cập nhật số trang (page)
        obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
        // Nếu là lần tải đầu tiên (state là null) hoặc yêu cầu tạo mảng mới, gọi API để đếm tổng số document
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send)
            .then(({ data: { totalDocs } }) => {
                // Khởi tạo cấu trúc dữ liệu mới với kết quả, trang hiện tại là 1 và tổng số lượng tài liệu
                obj = { results: data, page: 1, totalDocs };
            })
            .catch(err => {
                console.log(err);
            });
    }

    return obj;
};