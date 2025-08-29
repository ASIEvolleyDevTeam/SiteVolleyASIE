import { useState } from 'react';
import type { ReactNode } from 'react';
import { AdminContext } from './AdminContext';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/schedule/admin/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );

      if (res.ok) {
        setIsAdmin(true);
        setAdminPassword(password);
        return true;
      } else {
        setIsAdmin(false);
        setAdminPassword(null);
        return false;
      }
    } catch (err) {
      console.error('Erreur connexion backend', err);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminPassword(null);
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, adminPassword, loginAdmin, logoutAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
}
