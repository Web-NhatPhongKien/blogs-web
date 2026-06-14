import { useState } from 'react';
import API from '../services/authApi.service';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const email = form.email.trim();
        const password = form.password.trim();

        if (!email) {
            toast.error('Vui lòng nhập email');
            return false;
        }

        if (!isValidEmail(email)) {
            toast.error('Email không đúng định dạng');
            return false;
        }

        if (!password) {
            toast.error('Vui lòng nhập mật khẩu');
            return false;
        }

        if (password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = {
                email: form.email.trim().toLowerCase(),
                password: form.password
            };

            const res = await API.post('/login', payload);

            login(res.data);

            toast.success('Đăng nhập thành công');

            if (res.data.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            const message =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                'Đăng nhập thất bại';

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="auth-title">Mừng bạn trở lại</h1>

                <div className="input-group">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input-box"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    <i className="fi fi-rr-envelope input-icon"></i>
                </div>

                <div className="input-group">
                    <input
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        className="input-box"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    <i className="fi fi-rr-key input-icon"></i>
                </div>

                <button className="btn-dark" type="submit" disabled={loading}>
                    {loading ? 'Đang đăng nhập ...' : 'Đăng nhập'}
                </button>

                <p className="auth-link">
                    Bạn chưa có tài khoản ?{' '}
                    <Link to="/register">Tham gia với chúng tôi</Link>
                </p>
            </form>
        </section>
    );
}