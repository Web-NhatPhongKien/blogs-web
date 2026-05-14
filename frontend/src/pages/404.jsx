import { Link } from "react-router-dom";
import { useContext } from "react";
import pageNotFoundImg from "../imgs/404.png";
import logo from "../imgs/logo.png";

const PageNotFound = () => {
    
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            
            {/* Ảnh minh họa lỗi 404 */}
            <img 
                src={pageNotFoundImg} 
                className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" 
            />

            {/* Thông báo chính */}
            <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
            
            <p className="text-dark-grey text-xl leading-7 -mt-8">
                The page you are looking for does not exist. Head back to the <Link to="/" className="text-black underline">home page</Link>
            </p>

            {/* Khu vực logo ở dưới cùng */}
            <div className="mt-auto">
                <img 
                    src={logo} 
                    className="h-8 object-contain block mx-auto select-none" 
                />
                <p className="mt-5 text-dark-grey">Read millions of stories around the world</p>
            </div>

        </section>
    );
};

export default PageNotFound;
