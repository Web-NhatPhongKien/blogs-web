import { createContext, useContext, useEffect, useState, } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, }) => {
  const [user, setUser] =
    useState(null);

  useEffect(() => {

    const savedUser =
      sessionStorage.getItem('user');
    try {
      if (savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      sessionStorage.removeItem(
        'user'
      );
      sessionStorage.removeItem(
        'token'
      );
    }
  }, []);

  const login = (data) => {
    setUser(data.user);

    sessionStorage.setItem(
      'user',
      JSON.stringify(data.user)
    );

    sessionStorage.setItem(
      'token',
      data.token
    );
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);