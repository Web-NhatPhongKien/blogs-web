import { useState } from 'react';
import API from '../services/authApi.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] =
    useState({
      email: '',
      password: '',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post(
      '/login',
      form
    );

    login(res.data);

    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        placeholder='email'
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        type='password'
        placeholder='password'
        onChange={(e) =>
          setForm({
            ...form,
            password:
              e.target.value,
          })
        }
      />

      <button>Login</button>
    </form>
  );
}