import { useEffect, useState } from 'react';
import TableWrapper from '../TableWrapper';

type CalendarEntry = {
  date: string;
  team1: string;
  team2: string;
  referee: string;
};

export const GlobalCalendarTable = () => {
  const [calendar, setCalendar] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/global_calendar`)
      .then((res) => res.json())
      .then((data) => {
        setCalendar(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <TableWrapper
      loading={loading}
      dataLength={calendar.length}
      emptyMessage="Aucun match au calendrier global."
    >
      <table className="table">
        <thead className="bg-base-300">
          <tr>
            <th>Date</th>
            <th>Équipe 1</th>
            <th>Équipe 2</th>
            <th>Arbitre</th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
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
    </TableWrapper>
  );
};
export default GlobalCalendarTable;
