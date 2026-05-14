import { useState } from 'react';
import API from '../services/authApi.service';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      username: '',
      email: '',
      password: '',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post(
      '/register',
      form
    );

    alert('Register success');
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      <input
        placeholder='username'
        onChange={(e) =>
          setForm({
            ...form,
            username: e.target.value,
          })
        }
      />

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

      <button>Register</button>
    </form>
  );
}