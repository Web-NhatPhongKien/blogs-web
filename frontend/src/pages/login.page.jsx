import { useState } from 'react';
import API from '../services/authApi.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await API.post('/login', form);
        const token = res.data.token;
        if(res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
        login(res.data);
        navigate('/dashboard');
    };

    return (
        <section className="auth-section">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="auth-title">Welcome back</h1>

                <div className="input-group">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input-box"
                        onChange={handleChange}
                    />
                    <i className="fi fi-rr-envelope input-icon"></i> {/* Icon email [10] */}
                </div>

                <div className="input-group">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input-box"
                        onChange={handleChange}
                    />
                    <i className="fi fi-rr-key input-icon"></i> {/* Icon chìa khóa [10] */}
                </div>

                <button className="btn-dark" type="submit">Sign In</button>
                <p className="auth-link">
                    Don't you have an account ?
                    <a href="/register">Join us today</a>
                </p>
            </form>
        </section>
    );
}