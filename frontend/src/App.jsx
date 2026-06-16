import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import Profile from "./pages/profile.page";
import EditProfile from "./pages/edit-profile.page";
import Editor from "./components/editor.pages";
import Register from "./pages/register.page";
import Login from "./pages/login.page";
import ProtectedRoute from "./routes/protected.route";
import BlogPage from "./pages/blog.page";
import AdminRoute from "./routes/admin.route";
import AdminLayout from "./pages/admin/admin-layout.page";
import AdminDashboard from "./pages/admin/admin-dashboard.page";
import AdminUsers from "./pages/admin/admin-users.page";
import AdminBlogs from "./pages/admin/admin-blogs.page";
import AdminTags from "./pages/admin/admin-tags.page";
import NotificationPage from "./pages/notification.page"; 


const App = () => {
    return (
        <Routes>
            <Route
                    path="editor"
                    element={
                        <ProtectedRoute>
                            <Editor />
                        </ProtectedRoute>
                    }
                />
            <Route
                    path="editor/:blog_id"
                    element={
                        <ProtectedRoute>
                            <Editor />
                        </ProtectedRoute>
                    }
                />
            <Route path="/" element={<Navbar />}>
                <Route index element={<HomePage />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="settings/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="tags" element={<AdminTags />} />
                </Route>
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="user/:username" element={<Profile />} />
                <Route path="blog/:blog_id" element={<BlogPage />} />
                <Route
                    path="notifications"
                    element={
                        <ProtectedRoute>
                            <NotificationPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<PageNotFound />} />

            </Route>
        </Routes>
    );
}

export default App;
