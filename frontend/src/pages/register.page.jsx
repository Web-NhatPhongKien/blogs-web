import { useState } from 'react';
import API from '../services/authApi.service';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({ username: '', email: '', password: '' });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/register', form);
    alert('Register success');
    navigate('/login');
  };

  return (
    <section className="auth-section">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="auth-title">Join with us</h1>

        <div className="input-group">
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="input-box"
            onChange={handleChange}
          />
          <i className="fi fi-rr-user input-icon"></i>
        </div>

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

        <button className="btn-dark" type="submit">Sign Up</button>
        <p className="auth-link">
          You have an account ?
          <a href="/login">Welcome back</a>
        </p>
      </form>
    </section>
  );
}