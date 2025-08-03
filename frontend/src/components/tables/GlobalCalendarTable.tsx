import { useEffect, useState } from 'react';

type CalendarEntry = {
  date: string;
  team1: string;
  team2: string;
  referee: string;
};

export const GlobalCalendarTable = () => {
  const [calendar, setCalendar] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/global_calendar`)
      .then((res) => res.json())
      .then((data) => setCalendar(data));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="bg-base-200 table w-full">
        <thead className="bg-base-300">
          <tr>
            <th>Date</th>
            <th>Équipe 1</th>
            <th>Équipe 2</th>
            <th>Arbitre</th>
          </tr>
        </thead>
        <tbody>
          {calendar.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.team1}</td>
              <td>{entry.team2}</td>
              <td>{entry.referee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default GlobalCalendarTable;
