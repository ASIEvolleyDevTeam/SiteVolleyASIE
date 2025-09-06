import { useState } from 'react';
import { useSuperAdmin } from '../context/useSuperAdmin';

export const AddResultForm = () => {
  const { isSuperAdmin, superAdminPassword } = useSuperAdmin();

  const [form, setForm] = useState({
    date: '',
    team1: '',
    team2: '',
    set1_team1: 0,
    set1_team2: 0,
    set2_team1: 0,
    set2_team2: 0,
    set3_team1: null,
    set3_team2: null,
    referee: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    await fetch(`${import.meta.env.VITE_API_BASE}/api/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': superAdminPassword || '',
      },
      body: JSON.stringify(form),
    });

    alert('Résultat ajouté !');
  };

  if (!isSuperAdmin) {
    return;
  }

  return (
    <div className="card items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border p-4">
        <input name="date" placeholder="Date" onChange={handleChange} />
        <input name="team1" placeholder="Équipe 1" onChange={handleChange} />
        <input name="team2" placeholder="Équipe 2" onChange={handleChange} />
        <input name="set1_team1" type="number" onChange={handleChange} />
        <input name="set1_team2" type="number" onChange={handleChange} />
        <input name="set2_team1" type="number" onChange={handleChange} />
        <input name="set2_team2" type="number" onChange={handleChange} />
        <input name="set3_team1" type="number" onChange={handleChange} />
        <input name="set3_team2" type="number" onChange={handleChange} />
        <button type="submit" className="btn btn-primary">
          Ajouter
        </button>
      </form>
    </div>
  );
};
