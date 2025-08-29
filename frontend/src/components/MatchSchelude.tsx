import DaySection from './DaySection';
import type { Week } from '../types';
import { useState, useEffect } from 'react';
import { useAdmin } from '../context/useAdmin';

export default function MatchSchedule() {
  const [weeks, setWeeks] = useState<Week[]>([]);

  useEffect(() => {
    const fetchWeeks = async () => {
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + 14); // +2 semaines
      const res = await fetch(
        `/api/schedule?from=${from.toISOString()}&to=${to.toISOString()}`
      );
      const data = await res.json();
      setWeeks(data);
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
      <div className="relative m-4 flex items-center justify-center">
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
          className="btn btn-error btn-sm absolute right-0"
          onClick={handleAdminClick}
        >
          {isAdmin ? 'Quitter admin' : 'Mode admin'}
        </button>
      </div>

      {/* Week content */}
      <div className="grid grid-cols-2 gap-1">
        {week.days.map((day, di) => (
          <DaySection key={di} day={day} />
        ))}
      </div>
    </div>
  );
}
