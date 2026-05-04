import { useState } from "react";
import { signInAPI } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const { login } = useAuth(); // lấy hàm login từ context

  // state lưu dữ liệu form
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // xử lý khi user nhập input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value // cập nhật field tương ứng
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // chặn reload trang

    const data = await signInAPI(form); // gọi API login

    if (data.token) {
      // nếu login thành công → lưu token
      login({ token: data.token });
    } else {
      // nếu lỗi → hiển thị error
      alert(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;