import { useEffect, useState } from 'react';

type Match = {
  date: string;
  team1: string;
  team2: string;
  referee: string;
};

export const UpcomingMatchesTable = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch('/api/matches/upcoming')
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
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.team1}</td>
              <td>{match.team2}</td>
              <td>{match.referee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingMatchesTable;
