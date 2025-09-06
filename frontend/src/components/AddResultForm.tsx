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
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 p-6"
      >
        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Date</span>
          <input
            name="date"
            type="date"
            onChange={handleChange}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Équipe 1</span>
          <input
            name="team1"
            placeholder="Nom équipe 1"
            onChange={handleChange}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Équipe 2</span>
          <input
            name="team2"
            placeholder="Nom équipe 2"
            onChange={handleChange}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Set 1</span>
          <div className="flex gap-2">
            <input
              name="set1_team1"
              type="number"
              onChange={handleChange}
              className="input input-bordered w-20"
              placeholder="É1"
            />
            <input
              name="set1_team2"
              type="number"
              onChange={handleChange}
              className="input input-bordered w-20"
              placeholder="É2"
            />
          </div>
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Set 2</span>
          <div className="flex gap-2">
            <input
              name="set2_team1"
              type="number"
              onChange={handleChange}
              className="input input-bordered w-20"
              placeholder="É1"
            />
            <input
              name="set2_team2"
              type="number"
              onChange={handleChange}
              className="input input-bordered w-20"
              placeholder="É2"
            />
          </div>
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Set 3 (optionnel)</span>
          <div className="flex gap-2">
            <input
              name="set3_team1"
              type="number"
              onChange={handleChange}
              className="input input-bordered w-20"
              placeholder="É1"
            />
            <input
              name="set3_team2"
              type="number"
              onChange={handleChange}
              className="input input-bordered w-20"
              placeholder="É2"
            />
          </div>
        </label>

        <button type="submit" className="btn btn-primary mt-4">
          Ajouter
        </button>
      </form>
    </div>
  );
};
