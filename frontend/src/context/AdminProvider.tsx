import { useState } from 'react';
import type { ReactNode } from 'react';
import { AdminContext } from './AdminContext';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const loginAdmin = (password: string) => {
    if (password === 'monMotDePasse') {
      // TODO: remplacer par le vrai mot de passe
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
