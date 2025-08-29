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
  const { isAdmin } = useAdmin();

  const handleSubmit = () => {
    console.log('Inscription:', { team, password, slot });
    onClose();
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
            <option value="Équipe A">Équipe A</option>
            <option value="Équipe B">Équipe B</option>
            <option value="Équipe C">Équipe C</option>
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
