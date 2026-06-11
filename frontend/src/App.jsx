import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import Editor from "./components/editor.pages";
import Register from './pages/register.page';
import Login from './pages/login.page';
import ProtectedRoute from './routes/protected.route';
import Profile from "./pages/profile.page";
import EditProfile from "./pages/edit-profile.page";
import { Toaster } from "react-hot-toast";
import BlogPage from "./pages/blog.page";
import AdminRoute from "./routes/admin.route";
import AdminLayout from "./pages/admin/admin-layout.page";
import AdminDashboard from "./pages/admin/admin-dashboard.page";
import AdminUsers from "./pages/admin/admin-users.page";

const App = () => {
    return (
        <Routes>
            
            <Route path="/" element={<Navbar />} >
                <Route index element={<HomePage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
                />
                <Route path="/admin" element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>
                <Route path="/settings/edit-profile" element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                }
                />
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="user/:id" element={<ProfilePage />} />
                <Route path="*" element={<PageNotFound />} />

                <Route path="/blog/:blog_id" element={<BlogPage />} />
            </Route>

        </Routes>
    );
}

export default App;