import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state to manage initial checks

  // Check for existing token and user data on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    try {
      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUserData);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false); // Ensure loading state is updated regardless of success/failure
    }
  }, []);

  const login = (userData, token) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return false;
    }
    // Optionally, you can add token expiry validation logic here
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        validateToken,
        loading // Expose loading state to handle UI rendering
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context consumption
export const useAuth = () => useContext(AuthContext);
