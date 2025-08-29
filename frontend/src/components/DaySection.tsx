import TimeslotCard from './TimeslotCard';
import type { Day } from '../types';

interface DaySectionProps {
  day: Day;
  onUpdateTeams: (slotId: number, newTeams: string[]) => void;
}

export default function DaySection({ day, onUpdateTeams }: DaySectionProps) {
  return (
    <div className="card bg-base-200 p-2 shadow-lg">
      <h3 className="mb-3 text-center text-lg font-semibold">{day.label}</h3>
      <div className="grid h-full grid-rows-3 gap-3">
        {day.timeslots.map((slot, si) => (
          <TimeslotCard key={si} slot={slot} onUpdateTeams={onUpdateTeams} />
        ))}
      </div>
    </div>
  );
}
