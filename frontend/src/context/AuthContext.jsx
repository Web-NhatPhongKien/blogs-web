import { createContext, useContext, useEffect, useState } from "react";

// Tạo context để dùng global
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // lưu thông tin user

  // Khi reload trang → lấy lại user từ sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  }, []);

  // Hàm login → lưu user + token
  const login = (data) => {
    setUser(data); // lưu vào state
    sessionStorage.setItem("user", JSON.stringify(data)); // lưu vào storage
  };

  // Hàm logout → xoá user
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook để dùng nhanh
export const useAuth = () => useContext(AuthContext);