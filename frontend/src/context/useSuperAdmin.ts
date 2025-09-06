import { useContext } from 'react';
import { SuperAdminContext } from './SuperAdminContext';

export function useSuperAdmin() {
  const ctx = useContext(SuperAdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
