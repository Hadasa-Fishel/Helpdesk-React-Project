import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';
// 1. מבנה המשתמש המדויק לפי ה-Swagger שהעלית
interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; 
}

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: User | null; token: string | null } };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'INITIALIZE':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: !!action.payload.token, isInitialized: true };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      dispatch({ type: 'INITIALIZE', payload: { user: JSON.parse(savedUser), token: savedToken } });
    } else {
      dispatch({ type: 'INITIALIZE', payload: { user: null, token: null } });
    }
  }, []);

  const login = (user: any, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {state.isInitialized ? children : <div>טוען מערכת...</div>}
    </AuthContext.Provider>
  );
};

