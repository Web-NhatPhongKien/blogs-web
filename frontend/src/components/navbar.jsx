import { useState } from "react";
import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom"; // useNavigate ĐƯỢC THÊM TỪ PART 3

const Navbar = () => { // thanh công cụ 

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)

    // ==== BẮT ĐẦU PHẦN THÊM VÀO TỪ PART 3 ====
    let navigate = useNavigate();

    // Hàm xử lý tìm kiếm khi người dùng nhấn Enter [1, 2]
    const handleSearch = (e) => {
        let query = e.target.value;
        // Kiểm tra nếu phím nhấn là Enter (keyCode 13) và ô input không bị trống [2]
        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`); // Điều hướng người dùng tới trang tìm kiếm [2]
        }
    };
    // ==== KẾT THÚC PHẦN THÊM TỪ PART 3 ====

    return (
        <>
            <nav className="navbar">

                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>

                <div className={`absolute bg-white w-full left-0 top-full mt-0.5
                border-b border-grey py-4 px-[5vw]
                md:border-0 md:block md:relative
                md:inset-0 md:p-0 md:w-auto md:show
                ${searchBoxVisibility ? "show" : "hide"}`}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%]
                    md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                        onKeyDown={handleSearch} /* ==== THÊM SỰ KIỆN onKeyDown TỪ PART 3 ==== [1] */
                    />

                    <i className="fi fi-rr-search absolute right-[10%]
                    md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2
                    text-xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-grey w-12 h-12
                    rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}
                    >

                        <i className="fi fi-rr-search text-2xl "></i>
                    </button>

                    <Link to='/editor' className="flex md:flex gap-2 link">
                    <i className="fi fi-sr-pencil"></i>
                    </Link>
                    
                    <Link className="btn-dark 2py" to="/signin">
                        Sign in
                    </Link>

                    <Link className="btn-light 2py" to="/signup">
                        Sign up
                    </Link>
                </div>

            </nav>
            <Outlet />
        </>
    )
}

export default Navbar; 