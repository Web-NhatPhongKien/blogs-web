import { Link } from "react-router-dom";
import { useContext } from "react";
import pageNotFoundImg from "../imgs/404.png";
import logo from "../imgs/logo.png";

const PageNotFound = () => {
    
    return (
        <section className="page404">
            
            {/* Ảnh minh họa lỗi 404 */}
            <img 
                src={pageNotFoundImg} 
                className="page404-image"  
            />

            {/* Thông báo chính */}
            <h1 className="page404-title">Page not found</h1>
            
            <p className="page404-desc">
                The page you are looking for does not exist. Head back to the <Link to="/" className="page404-link">home page</Link>
            </p>

            {/* Khu vực logo ở dưới cùng */}
            <div className="page404-footer">
                <img 
                    src={logo} 
                    className="page404-logo"
                />
                <p className="page404-note">Read millions of stories around the world</p>
            </div>

        </section>
    );
};

export default PageNotFound;
