import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isValidBase64 = (str) => {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isValidBase64(token.split(".")[1])) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);
  

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);