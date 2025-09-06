import { createContext } from 'react';

interface SuperAdminContextProps {
  isSuperAdmin: boolean;
  superAdminPassword: string | null;
  loginSuperAdmin: (password: string) => Promise<boolean>; // ✅ async
  logoutSuperAdmin: () => void;
}

export const SuperAdminContext = createContext<
  SuperAdminContextProps | undefined
>(undefined);
