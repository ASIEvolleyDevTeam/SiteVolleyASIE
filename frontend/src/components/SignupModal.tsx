import { useState } from 'react';
import type { Slot } from '../types';
import { useAdmin } from '../context/useAdmin';

interface SignupModalProps {
  slot: Slot;
  onClose: () => void;
}

export default function SignupModal({ slot, onClose }: SignupModalProps) {
  const [password, setPassword] = useState('');
  const [team, setTeam] = useState('');
  const { isAdmin, adminPassword } = useAdmin();

  const handleSubmit = async () => {
    if (!team) {
      alert('Veuillez sélectionner une équipe.');
      return;
    }

    const res = await fetch(`/api/schedule/slots/${slot.id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: team,
        password: isAdmin ? adminPassword : password,
      }),
    });

    if (res.ok) {
      onClose();
      window.location.reload(); // TODO: remplacer plus tard par un setState intelligent
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
