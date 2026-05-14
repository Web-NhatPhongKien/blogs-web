import logo from "../imgs/logo.png";
import { Link } from "react-router-dom";
const Blogseditor = ()=>{
    return(
        <nav className="navbar gap-4">
            <Link to="/" className="flex-none w-10 ">
                <img src={logo} className="w-10" />
            </Link>
            <p>New Blog</p>
            <div className="flex gap-4 ml-auto ">
                <button className="btn-dark p-2 text-sm">
                    Publish
                </button>
                <button className="btn-light p-2 text-sm">
                    Save Draft
                </button>
            </div>
        </nav>
        
    )
}
 export default Blogseditor;