import { useEffect, useState } from 'react';
import TableWrapper from '../TableWrapper';

type Match = {
  date: string;
  team1: string;
  team2: string;
  referee: string;
};

export const PostponedMatchesTable = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/matches/postponed`)
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
      emptyMessage="Aucun match en attente de report."
    >
      <table className="table-zebra table w-full text-center">
        <thead className="bg-base-300">
          <tr>
            <th>Date</th>
            <th>Équipe 1</th>
            <th>Équipe 2</th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
          {matches.map((m, i) => (
            <tr key={i}>
              <td>{m.date}</td>
              <td>{m.team1}</td>
              <td>{m.team2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};
export default PostponedMatchesTable;
