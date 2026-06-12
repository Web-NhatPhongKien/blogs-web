import { createContext, useContext, useEffect, useState, } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    try {
      if (savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    } finally {
      //đọc sessionStorage xong thì mới cho ProtectedRoute kiểm tra
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    setUser(data.user); 

    sessionStorage.setItem('user', JSON.stringify(data.user));

    sessionStorage.setItem('token', data.token);
    //console.log(data.user);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{user, setUser, loading, login, logout,}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);