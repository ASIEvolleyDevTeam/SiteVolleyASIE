import { useState } from 'react';
import { RankingTable } from '../components/tables/RankingTable';

export const Ranking = () => {
  const [poolId, setPoolId] = useState(1);

  return (
    <main className="mx-auto max-w-5xl">
      <h1 className="mb-4 pt-8 text-center text-4xl font-bold">Classement</h1>
      <section className="flex justify-center gap-8 p-2">
        {[1, 2, 3].map((id) => (
          <label
            key={id}
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <input
              type="radio"
              name="poule"
              className="radio"
              checked={poolId === id}
              onChange={() => setPoolId(id)}
            />
            <span>{`Poule ${String.fromCharCode(64 + id)}`}</span>
          </label>
        ))}
      </section>

      <RankingTable poolId={poolId} />
    </main>
  );
};

export default Ranking;
