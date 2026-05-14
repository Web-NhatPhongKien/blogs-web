import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import UserAuthForm from "./pages/userAuthForm";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search";
import PageNotFound from "./pages/404";
import ProfilePage from "./pages/profile";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar />} >
                <Route index element={<HomePage />} />
                <Route path="signin" element={<UserAuthForm type="sign-in"/>}/>
                <Route path="signup" element={<UserAuthForm type="sign-up"/>}/>
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="user/:id" element={<ProfilePage />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
            
        </Routes>
    );
}

export default App;