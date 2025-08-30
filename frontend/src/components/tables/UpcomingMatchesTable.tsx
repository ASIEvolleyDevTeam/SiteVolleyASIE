import { useEffect, useState } from 'react';
import TableWrapper from '../TableWrapper';

type Match = {
  date: string;
  team1: string;
  team2: string;
  referee: string;
};

export const UpcomingMatchesTable = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/matches/upcoming`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
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
      dataLength={matches.length}
      emptyMessage="Pas de matchs à venir pour l’instant."
    >
      <table className="table-zebra table text-center">
        <thead className="bg-base-300">
          <tr>
            <th>Date</th>
            <th>Équipe 1</th>
            <th>Équipe 2</th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.team1}</td>
              <td>{match.team2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default UpcomingMatchesTable;
