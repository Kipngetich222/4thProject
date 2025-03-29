import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCurrentUser(null);
  };

  const updateUserProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, currentUser, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
