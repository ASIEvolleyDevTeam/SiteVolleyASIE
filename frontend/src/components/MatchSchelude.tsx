import DaySection from './DaySection';
import type { Week } from '../types';
import { useState } from 'react';
import { useAdmin } from '../context/useAdmin';

interface MatchScheduleProps {
  weeks: Week[];
}
export default function MatchSchedule({ weeks }: MatchScheduleProps) {
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
            Semaine du {week.start}
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
