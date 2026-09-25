import { useState } from 'react';
import { CURRENT_TEAMS } from '../constants/teams';
import { useSuperAdmin } from '../context/useSuperAdmin';

export const PostponeForm = () => {
  const { isSuperAdmin, superAdminPassword } = useSuperAdmin();

  const [form, setForm] = useState({
    date: '',
    team1: '',
    team2: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/postpone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': superAdminPassword || '',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // backend returned an error (400 / 403 / 500…)
        const err = await res.json().catch(() => ({}));
        alert(
          `Erreur lors de la mise en attente du match ${
            err.error || res.statusText || 'Erreur inconnue'
          }`
        );
        return;
      }

      const data = await res.json();

      if (data.success) {
        alert('✅ Match reporté avec succès !');
        // facultatif: reset le formulaire
        setForm({
          date: '',
          team1: '',
          team2: '',
        });
      } else {
        alert(
          `⚠️ Le serveur n'a pas confirmé le report: ${
            data.error || 'raison inconnue'
          }`
        );
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
      alert('Impossible de contacter le serveur.');
    }
  };

  if (!isSuperAdmin) {
    return;
  }

  return (
    <div className="card bg-base-200 mt-2 items-center p-6">
      <form onSubmit={handleSubmit} className="gap-4 p-6">
        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Date initiale du match</span>
          <input
            name="date"
            type="date"
            onChange={handleChange}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Équipe 1</span>
          <select
            name="team1"
            className="select select-bordered w-full"
            value={form.team1}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner une équipe --</option>
            {CURRENT_TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-semibold">Équipe 2</span>
          <select
            name="team2"
            className="select select-bordered w-full"
            value={form.team2}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner une équipe --</option>
            {CURRENT_TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn btn-primary mt-4">
          Reporter le match
        </button>
      </form>
    </div>
  );
};
