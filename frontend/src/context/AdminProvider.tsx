import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AdminContext } from './AdminContext';

export function AdminProvider({ children }: { children: ReactNode }) {
  // restore from localStorage if present
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState<string | null>(() => {
    return localStorage.getItem('adminPassword');
  });

  // keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('isAdmin', String(isAdmin));
    if (adminPassword) {
      localStorage.setItem('adminPassword', adminPassword);
    } else {
      localStorage.removeItem('adminPassword');
    }
  }, [isAdmin, adminPassword]);

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
      setIsAdmin(false);
      setAdminPassword(null);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminPassword(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminPassword');
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, adminPassword, loginAdmin, logoutAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
}
