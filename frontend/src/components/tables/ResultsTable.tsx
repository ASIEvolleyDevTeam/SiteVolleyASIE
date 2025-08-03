import { useEffect, useState } from 'react';

type MatchResult = {
  date: string;
  team1: string;
  team2: string;
  set1_team1: number;
  set1_team2: number;
  set2_team1: number;
  set2_team2: number;
  set3_team1: number | null;
  set3_team2: number | null;
  referee: string;
};

export const ResultsTable = () => {
  const [results, setResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/results`)
      .then((res) => res.json())
      .then((data) => setResults(data));
  }, []);

  return (
    <div className="overflow-x-auto p-8">
      <table className="bg-base-200 table w-full">
        <thead className="bg-base-300">
          <tr>
            <th>Date</th>
            <th>Équipe 1</th>
            <th>Équipe 2</th>
            <th>Set 1</th>
            <th>Set 2</th>
            <th>Set 3</th>
            <th>Arbitre</th>
          </tr>
        </thead>
        <tbody>
          {results.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.team1}</td>
              <td>{match.team2}</td>
              <td>
                {match.set1_team1} - {match.set1_team2}
              </td>
              <td>
                {match.set2_team1} - {match.set2_team2}
              </td>
              <td>
                {match.set3_team1 !== null && match.set3_team2 !== null
                  ? `${match.set3_team1} - ${match.set3_team2}`
                  : '—'}
              </td>
              <td>{match.referee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ResultsTable;
