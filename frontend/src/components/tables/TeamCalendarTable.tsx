import { useEffect, useState } from 'react';

type Match = {
  date: string;
  team1: string;
  team2: string;
  set1_team1: number | null;
  set1_team2: number | null;
  set2_team1: number | null;
  set2_team2: number | null;
  set3_team1: number | null;
  set3_team2: number | null;
  referee: string | null;
};

export const TeamCalendarTable = ({ teamName }: { teamName: string }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/team_calendar/${teamName}`)
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, [teamName]);

  return (
    <div className="overflow-x-auto">
      <table className="table-bordered table w-full text-center text-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Equipe 1</th>
            <th>Equipe 2</th>
            <th>Set 1</th>
            <th>Set 2</th>
            <th>Set 3</th>
            <th>Arbitre</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => (
            <tr key={i}>
              <td>{m.date}</td>
              <td>{m.team1}</td>
              <td>{m.team2}</td>
              <td>
                {m.set1_team1} – {m.set1_team2}
              </td>
              <td>
                {m.set2_team1} – {m.set2_team2}
              </td>
              <td>
                {m.set3_team1 !== null
                  ? `${m.set3_team1} – ${m.set3_team2}`
                  : '—'}
              </td>
              <td>{m.referee || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TeamCalendarTable;
