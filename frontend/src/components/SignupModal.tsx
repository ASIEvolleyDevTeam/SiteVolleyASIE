import { useState } from 'react';
import type { Slot } from '../types';
import { useAdmin } from '../context/useAdmin';
import { CURRENT_TEAMS } from '../constants/teams';

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
            {CURRENT_TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
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
