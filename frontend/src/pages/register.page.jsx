import { useState } from 'react';
import API from '../services/authApi.service';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
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
        const username = form.username.trim();
        const email = form.email.trim();
        const password = form.password.trim();

        if (!username) {
            toast.error('Vui lòng nhập username');
            return false;
        }

        if (username.length < 3) {
            toast.error('Username phải có ít nhất 3 ký tự');
            return false;
        }

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
                username: form.username.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password
            };

            await API.post('/register', payload);

            toast.success('Đăng ký thành công');

            navigate('/login');
        } catch (err) {
            const message =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                'Đăng ký thất bại';

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="auth-title">Tham gia với chúng tôi</h1>

                <div className="input-group">
                    <input
                        name="username"
                        type="text"
                        placeholder="Tên tài khoản"
                        className="input-box"
                        value={form.username}
                        onChange={handleChange}
                        autoComplete="username"
                    />
                    <i className="fi fi-rr-user input-icon"></i>
                </div>

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
                        autoComplete="new-password"
                    />
                    <i className="fi fi-rr-key input-icon"></i>
                </div>

                <button className="btn-dark" type="submit" disabled={loading}>
                    {loading ? 'Đang đăng ký ...' : 'Đăng ký'}
                </button>

                <p className="auth-link">
                    Bạn đã có tài khoản ?{' '}
                    <Link to="/login">Mừng bạn trở lại</Link>
                </p>
            </form>
        </section>
    );
}