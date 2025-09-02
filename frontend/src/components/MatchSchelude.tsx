import DaySection from './DaySection';
import type { Week, Day, Slot } from '../types';
import { useState, useEffect } from 'react';
import { useAdmin } from '../context/useAdmin';

export default function MatchSchedule() {
  const [weeks, setWeeks] = useState<Week[]>([]);

  useEffect(() => {
    function getClosestMonday(date: Date): Date {
      const d = new Date(date);
      const day = d.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

      if (day === 1) {
        // already Monday
        return d;
      }

      // otherwise, go backwards to previous Monday
      const diff = (day + 6) % 7; // how many days since last Monday
      d.setDate(d.getDate() - diff);
      return d;
    }

    const fetchWeeks = async () => {
      const today = new Date();
      const from = getClosestMonday(today); // 👈 normalize to Monday
      const to = new Date();
      to.setDate(to.getDate() + 21); // +2 semaines
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/schedule?from=${from.toISOString()}&to=${to.toISOString()}`
      );
      const data = await res.json();
      // enrich each slot with week_start_date
      const enriched = data.map((week: Week) => ({
        ...week,
        days: week.days.map((day: Day) => ({
          ...day,
          terrainslots: day.terrainslots.map((slot: Slot) => ({
            ...slot,
            week_start_date: week.start_date,
          })),
        })),
      }));

      setWeeks(enriched);
    };
    fetchWeeks();
  }, []);
  const [currentWeek, setCurrentWeek] = useState(0);
  const { isAdmin, loginAdmin, logoutAdmin } = useAdmin();

  const handleAdminClick = () => {
    if (isAdmin) {
      logoutAdmin();
    } else {
      const pwd = prompt('Entrer le mot de passe admin :');
      if (pwd && !loginAdmin(pwd)) {
        alert('Mot de passe incorrect');
      }
    }
  };

  const handlePrev = () => {
    setCurrentWeek((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentWeek((prev) => (prev < weeks.length - 1 ? prev + 1 : prev));
  };

  const updateSlotTeams = (slotId: number, newTeams: string[]) => {
    setWeeks((prev) =>
      prev.map((week) => ({
        ...week,
        days: week.days.map((day) => ({
          ...day,
          terrainslots: day.terrainslots.map((slot: Slot) =>
            slot.id === slotId ? { ...slot, teams: newTeams } : slot
          ),
        })),
      }))
    );
  };

  const week = weeks[currentWeek];

  if (!week) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="m-2">
      {/* Header with arrows */}
      <div className="m-4 flex flex-col items-center lg:relative lg:flex-row lg:justify-center">
        {/* Center group */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentWeek === 0}
            className="btn btn-circle btn-outline"
          >
            ←
          </button>
          <h2 className="text-center text-xl font-bold">
            Semaine du {new Date(week.start_date).toLocaleDateString('fr-FR')}
          </h2>
          <button
            onClick={handleNext}
            disabled={currentWeek === weeks.length - 1}
            className="btn btn-circle btn-outline"
          >
            →
          </button>
        </div>

        {/* Admin button absolutely positioned to the right */}
        <button
          className="btn btn-error btn-sm mt-2 lg:absolute lg:right-0 lg:mt-0"
          onClick={handleAdminClick}
        >
          {isAdmin ? 'Quitter admin' : 'Mode admin'}
        </button>
      </div>

      {/* Week content */}
      <div className="grid grid-cols-2 gap-1">
        {week.days.map((day, di) => (
          <DaySection key={di} day={day} onUpdateTeams={updateSlotTeams} />
        ))}
      </div>
    </div>
  );
}
