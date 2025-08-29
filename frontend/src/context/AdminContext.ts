import { createContext } from 'react';

interface AdminContextProps {
  isAdmin: boolean;
  adminPassword: string | null;
  loginAdmin: (password: string) => Promise<boolean>; // ✅ async
  logoutAdmin: () => void;
}

export const AdminContext = createContext<AdminContextProps | undefined>(
  undefined
);
