import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  error?: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (loading) {
        console.error("Firebase auth state change timed out after 5 seconds");
        setError("La conexión con el sistema de autenticación está tardando demasiado. Por favor, verifica tu conexión o intenta recargar la página.");
        setLoading(false);
      }
    }, 5000);

    try {
      console.log("Initializing auth state listener...");
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        console.log("Auth state changed:", u ? u.uid : null);
        setUser(u);
        setLoading(false);
        clearTimeout(timeout);
      }, (err) => {
        console.error("Auth state error:", err);
        setError(err.message);
        setLoading(false);
        clearTimeout(timeout);
      });
      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch (err: any) {
      console.error("Auth init error:", err);
      setError(err.message);
      setLoading(false);
      clearTimeout(timeout);
    }
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error signing in', error);
      setError(`Error al iniciar sesión: ${error.message || error}`);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
