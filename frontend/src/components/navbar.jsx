import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/auth.context";

const Navbar = () => { // thanh công cụ 

    let navigate = useNavigate();

    const {user} = useAuth();

    const handleSearch = (e) => {
        let query = e.target.value;

        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`); 
        }
    };


    return (
        <>
            <nav className="navbar">

                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>

                <div className="relative bg-white w-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-auto bg-grey p-4 pr-6 rounded-full placeholder:text-dark-grey pl-12"
                        onKeyDown={handleSearch} 
                    />

                    <i className="fi fi-rr-search absolute pointer-events-none left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <Link to='/editor' className="flex md:flex gap-2 link">
                        <i className="fi fi-sr-pencil">Click to edit</i>
                    </Link>

                    {user ? (
                        <Link
                            to="/profile"
                            className="w-12 h-12
                                        rounded-full border
                                        flex items-center
                                        justify-center"
                        >
                            <i className="fi fi-rr-user"></i>
                        </Link>
                    ) : (
                        <>
                            <Link
                                className="btn-dark"
                                to="/login"
                            >
                                Sign in
                            </Link>

                            <Link
                                className="btn-light"
                                to="/register"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

            </nav>
            <Outlet />
        </>
    )
}

export default Navbar; 
