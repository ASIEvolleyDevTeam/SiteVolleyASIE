import { useEffect, useState } from 'react';

type Match = {
  date: string;
  team1: string;
  team2: string;
  referee: string;
};

export const PostponedMatchesTable = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch('/api/matches/postponed')
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Équipe 1</th>
            <th>Équipe 2</th>
            <th>Arbitre</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => (
            <tr key={i}>
              <td>{m.date}</td>
              <td>{m.team1}</td>
              <td>{m.team2}</td>
              <td>{m.referee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PostponedMatchesTable;
