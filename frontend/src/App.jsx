import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search";
import PageNotFound from "./pages/404";
import ProfilePage from "./pages/profile";
import Editor from "./components/editor.pages";
import Register from './pages/register.page';
import Login from './pages/login.page';
import Dashboard from './pages/dashboard.page';
import ProtectedRoute from './routes/protected.route';
import Profile from "./pages/profile.page";

const App = () => {
    return (
        <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/" element={<Navbar />} >
                <Route index element={<HomePage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
                />
                <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="user/:id" element={<ProfilePage />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>

        </Routes>
    );
}

export default App;