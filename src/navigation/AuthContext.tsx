import { createContext, useContext } from 'react';

type AuthValue = { signIn: () => void; signOut: () => void };

export const AuthContext = createContext<AuthValue>({
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);