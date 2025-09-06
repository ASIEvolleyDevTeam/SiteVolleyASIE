import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { SuperAdminContext } from './SuperAdminContext';

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  // restore from localStorage if present
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isSuperAdmin') === 'true';
  });
  const [superAdminPassword, setSuperAdminPassword] = useState<string | null>(
    () => {
      return localStorage.getItem('SuperAdminPassword');
    }
  );

  // keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('isSuperAdmin', String(isSuperAdmin));
    if (superAdminPassword) {
      localStorage.setItem('superAdminPassword', superAdminPassword);
    } else {
      localStorage.removeItem('superAdminPassword');
    }
  }, [isSuperAdmin, superAdminPassword]);

  const loginSuperAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/super_admin/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );

      if (res.ok) {
        setIsSuperAdmin(true);
        setSuperAdminPassword(password);
        return true;
      } else {
        setIsSuperAdmin(false);
        setSuperAdminPassword(null);
        return false;
      }
    } catch (err) {
      console.error('Erreur connexion backend', err);
      setIsSuperAdmin(false);
      setSuperAdminPassword(null);
      return false;
    }
  };

  const logoutSuperAdmin = () => {
    setIsSuperAdmin(false);
    setSuperAdminPassword(null);
    localStorage.removeItem('isSuperAdmin');
    localStorage.removeItem('superAdminPassword');
  };

  return (
    <SuperAdminContext.Provider
      value={{
        isSuperAdmin,
        superAdminPassword,
        loginSuperAdmin,
        logoutSuperAdmin,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}
