import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("userId", newUser.id.toString());
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  }, []);

  const login = useCallback((newUser: User) => {
    setUser(newUser);
  }, [setUser]);

  const logout = useCallback(() => {
    setUserState(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  }, [navigate]);

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
