import { useState } from 'react';
import SignupModal from './SignupModal';
import type { Slot } from '../types';
import { useAdmin } from '../context/useAdmin';

interface TimeslotCardProps {
  slot: Slot;
}

export default function TimeslotCard({ slot }: TimeslotCardProps) {
  const [open, setOpen] = useState(false);
  const { isAdmin, adminPassword } = useAdmin();

  // valeurs des deux côtés
  const teamA = slot.teams[0] ?? '???';
  const teamB = slot.teams[1] ?? '???';

  const handleUnregister = async (teamName: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/api/schedule/slots/${slot.id}/unregister`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          password: adminPassword, // récupéré du contexte
        }),
      }
    );

    if (res.ok) {
      window.location.reload();
    } else {
      const err = await res.json();
      alert(err.error || 'Erreur lors de la désinscription');
    }
  };

  return (
    <div className="card bg-base-100 flex flex-col shadow">
      <h4 className="mt-2 text-center font-bold">{slot.time}</h4>

      <div className="flex flex-col items-center lg:flex-row">
        <div
          className={`rounded-box bg-base-300 mx-2 flex flex-1 flex-row items-center p-2 ${
            isAdmin && slot.teams[0] ? 'justify-between' : 'justify-center'
          }`}
        >
          {isAdmin && slot.teams[0] && (
            <button
              className="btn btn-xs btn-error"
              onClick={() => handleUnregister(slot.teams[0])}
            >
              ✖
            </button>
          )}
          <span className="text-sm font-medium">{teamA}</span>
        </div>

        <div className="divider lg:divider-horizontal">VS</div>

        <div
          className={`rounded-box bg-base-300 mx-2 flex flex-1 flex-row items-center p-2 ${
            isAdmin && slot.teams[1] ? 'justify-between' : 'justify-center'
          }`}
        >
          <span className="text-sm font-medium">{teamB}</span>
          {isAdmin && slot.teams[1] && (
            <button
              className="btn btn-xs btn-error"
              onClick={() => handleUnregister(slot.teams[1])}
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* bouton inscription */}
      <div className="flex flex-col p-2">
        {slot.teams.length < 2 ? (
          <button
            className={`btn btn-sm ${
              slot.teams.length === 0 ? 'btn-primary' : 'btn-warning'
            }`}
            onClick={() => setOpen(true)}
          >
            Inscrire une équipe
          </button>
        ) : (
          <button className="btn btn-neutral btn-sm" disabled>
            Créneau réservé
          </button>
        )}
      </div>

      {open && <SignupModal slot={slot} onClose={() => setOpen(false)} />}
    </div>
  );
}
