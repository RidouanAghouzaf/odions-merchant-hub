// src/context/AuthProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  role: "admin" | "merchant";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>; // return success/fail
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    // ✅ Fake authentication
    if (email === "admin@demo.com" && password === "admin123") {
      const loggedUser = { email, role: "admin" as const };
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      navigate("/users");
      return true;
    }

    if (email === "merchant@demo.com" && password === "merchant123") {
      const loggedUser = { email, role: "merchant" as const };
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      navigate("/orders");
      return true;
    }

    // ❌ invalid credentials
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
// src/context/AuthProvider.tsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// interface User {
//   id: string;
//   email: string;
//   role: "admin" | "merchant";
//   full_name?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });
//   const navigate = useNavigate();

//   // 🔑 Real login function calling backend
//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const response = await axios.post("/api/auth/signin", { email, password });

//       const { user, session } = response.data;

//       // Store session or token if needed
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("session", JSON.stringify(session));

//       setUser(user);

//       // Navigate based on role
//       if (user.role === "admin") navigate("/users");
//       else navigate("/orders");

//       return true;
//     } catch (error: any) {
//       console.error("Login error:", error.response?.data || error.message);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("session");
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
