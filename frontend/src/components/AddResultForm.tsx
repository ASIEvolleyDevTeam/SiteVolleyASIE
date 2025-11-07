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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/results`, {
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
          `Erreur lors de l'ajout du résultat: ${
            err.error || res.statusText || 'Erreur inconnue'
          }`
        );
        return;
      }

      const data = await res.json();

      if (data.success) {
        alert('✅ Résultat ajouté avec succès !');
        // facultatif: reset le formulaire
        setForm({
          date: '',
          team1: '',
          team2: '',
          set1_team1: 0,
          set1_team2: 0,
          set2_team1: 0,
          set2_team2: 0,
          set3_team1: null,
          set3_team2: null,
        });
      } else {
        alert(
          `⚠️ Le serveur n'a pas confirmé l'ajout: ${
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
          <span className="mb-1 font-semibold">Date du match</span>
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
            <option value="AirFrance">AirFrance</option>
            <option value="Arm1">Arm1</option>
            <option value="FortiTeam">FortiTeam</option>
            <option value="Renault">Renault</option>
            <option value="Amadeus 2">Amadeus 2</option>
            <option value="Arm2">Arm2</option>
            <option value="CADENCE">CADENCE</option>
            <option value="InDeMENTAble">InDeMENTAble</option>
            <option value="Thales DIS1">Thales DIS1</option>
            <option value="Synopsys">Synopsys</option>
            <option value="THALES">THALES</option>
            <option value="Amadeus 1">Amadeus 1</option>
            <option value="NXP1">NXP1</option>
            <option value="EURECOM 1">EURECOM 1</option>
            <option value="SiMoVolley">SiMoVolley</option>
            <option value="EkipEkip">EkipEkip</option>
            <option value="EURECOM 2">EURECOM 2</option>
            <option value="NXP2">NXP2</option>
            <option value="Thales DIS2">Thales DIS2</option>
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
            <option value="AirFrance">AirFrance</option>
            <option value="Arm1">Arm1</option>
            <option value="FortiTeam">FortiTeam</option>
            <option value="Renault">Renault</option>
            <option value="Amadeus 2">Amadeus 2</option>
            <option value="Arm2">Arm2</option>
            <option value="CADENCE">CADENCE</option>
            <option value="InDeMENTAble">InDeMENTAble</option>
            <option value="Thales DIS1">Thales DIS1</option>
            <option value="Synopsys">Synopsys</option>
            <option value="THALES">THALES</option>
            <option value="Amadeus 1">Amadeus 1</option>
            <option value="NXP1">NXP1</option>
            <option value="EURECOM 1">EURECOM 1</option>
            <option value="SiMoVolley">SiMoVolley</option>
            <option value="EkipEkip">EkipEkip</option>
            <option value="EURECOM 2">EURECOM 2</option>
            <option value="NXP2">NXP2</option>
            <option value="Thales DIS2">Thales DIS2</option>
          </select>
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

  );
};
