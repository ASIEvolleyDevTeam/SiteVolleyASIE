import { useEffect, useState } from 'react';
import TableWrapper from '../TableWrapper';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/team_calendar/${teamName}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [teamName]);

  return (
    <TableWrapper
      loading={loading}
      dataLength={matches.length}
      emptyMessage="Pas de matchs à venir pour l’instant."
    >
      <table className="table text-center text-sm">
        <thead className="bg-base-300">
          <tr>
            <th>Date</th>
            <th>Equipe 1</th>
            <th>Equipe 2</th>
            <th>Set 1</th>
            <th>Set 2</th>
            <th>Set 3</th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
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
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};
export default TeamCalendarTable;
