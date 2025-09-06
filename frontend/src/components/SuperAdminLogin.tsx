import { useState } from 'react';
import { useSuperAdmin } from '../context/useSuperAdmin';

export const SuperAdminLogin = () => {
  const { isSuperAdmin, loginSuperAdmin, logoutSuperAdmin } = useSuperAdmin();
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await loginSuperAdmin(password);
    if (!ok) {
      alert('Mot de passe incorrect');
    }
    setPassword('');
  };

  if (isSuperAdmin) {
    return (
      <div className="bg-base-200 flex gap-2 rounded border p-4">
        <p className="flex-1">✅ Connecté en tant qu’admin résultats</p>
        <button onClick={logoutSuperAdmin} className="btn btn-secondary">
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="card items-center">
      <form
        onSubmit={handleLogin}
        className="bg-base-200 flex gap-2 rounded p-4"
      >
        <input
          type="password"
          value={password}
          placeholder="Mot de passe admin"
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary">
          Connexion
        </button>
      </form>
    </div>
  );
};
