import { useEffect, useState } from 'react';
import TableWrapper from '../TableWrapper';

type Ranking = {
  team: string;
  points: number;
  victory: number;
  defeat: number;
  no_show: number;
  no_referee: number;
  set_for: number;
  set_against: number;
  set_ratio: number;
  points_for: number;
  points_against: number;
  point_ratio: number;
};

export const RankingTable = ({ poolId }: { poolId: number }) => {
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/rankings/${poolId}`)
      .then((res) => res.json())
      .then((data) => {
        setRanking(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [poolId]);

  return (
    <TableWrapper
      loading={loading}
      dataLength={ranking.length}
      emptyMessage="Aucun classement pour cette poule."
    >
      <table className="table text-center">
        <thead className="bg-base-300">
          <tr>
            <th rowSpan={2}>Équipe</th>
            <th rowSpan={2}>Points</th>
            <th colSpan={2}>Matchs</th>
            <th colSpan={2}>Pénalités</th>
            <th colSpan={3}>Sets</th>
            <th colSpan={3}>Points</th>
          </tr>
          <tr>
            <th>Gagnés</th>
            <th>Perdus</th>
            <th>Forfait</th>
            <th>Arbitrage</th>
            <th>Pour</th>
            <th>Contre</th>
            <th>Ratio</th>
            <th>Pour</th>
            <th>Contre</th>
            <th>Ratio</th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
          {ranking.map((team, index) => (
            <tr key={index}>
              <td>{team.team}</td>
              <td>{team.points}</td>
              <td>{team.victory}</td>
              <td>{team.defeat}</td>
              <td>{team.no_show}</td>
              <td>{team.no_referee}</td>
              <td>{team.set_for}</td>
              <td>{team.set_against}</td>
              <td>{team.set_ratio}</td>
              <td>{team.points_for}</td>
              <td>{team.points_against}</td>
              <td>{team.point_ratio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};
export default RankingTable;
