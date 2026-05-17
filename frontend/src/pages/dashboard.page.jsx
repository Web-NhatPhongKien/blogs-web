import { useAuth } from '../context/auth.context';

export default function Dashboard() {
  const { user, logout } =
    useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome {user?.username}
      </p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}