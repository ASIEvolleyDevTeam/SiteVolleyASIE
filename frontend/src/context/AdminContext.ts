import { createContext } from 'react';

interface AdminContextProps {
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

export const AdminContext = createContext<AdminContextProps | undefined>(
  undefined
);
