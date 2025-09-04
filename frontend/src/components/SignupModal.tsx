import { useState } from 'react';
import type { Slot } from '../types';
import { useAdmin } from '../context/useAdmin';

interface SignupModalProps {
  slot: Slot;
  onClose: () => void;
  onUpdateTeams: (slotId: number, newTeams: string[]) => void;
}

export default function SignupModal({
  slot,
  onClose,
  onUpdateTeams,
}: SignupModalProps) {
  const [password, setPassword] = useState('');
  const [team, setTeam] = useState('');
  const { isAdmin, adminPassword } = useAdmin();

  const handleSubmit = async () => {
    if (!team) {
      alert('Veuillez sélectionner une équipe.');
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/api/schedule/slots/${slot.id}/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: team,
          password: isAdmin ? adminPassword : password,
        }),
      }
    );

    if (res.ok) {
      onUpdateTeams(slot.id, [...slot.teams, team]);
      onClose();
    } else {
      const err = await res.json();
      alert(err.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box">
        {!isAdmin && (
          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text">Mot de passe</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <div className="form-control mb-3">
          <label className="label">
            <span className="label-text mb-2">Votre équipe</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <option value="">-- Sélectionner une équipe --</option>
            <option value="EURECOM">EURECOM</option>
            <option value="Synopsys">Synopsys</option>
            <option value="NXP2">NXP2</option>
            <option value="FortiTeam">FortiTeam</option>
            <option value="NXP1">NXP1</option>
            <option value="AirFrance">AirFrance</option>
            <option value="SiMoVolley">SiMoVolley</option>
            <option value="Thales DIS1">Thales DIS1</option>
            <option value="Thales DIS2">Thales DIS2</option>
            <option value="Arm1">Arm1</option>
            <option value="Arm2">Arm2</option>
            <option value="Thales">Thales</option>
            <option value="EkipEkip">EkipEkip</option>
          </select>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Valider
          </button>
        </div>
      </div>
    </dialog>
  );
}
