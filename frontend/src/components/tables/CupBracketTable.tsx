import { useEffect, useState } from 'react';

type CupMatch = {
  id: number;
  date: string;
  team1: string | null;
  team2: string | null;
  winner: string | null;
  set1_team1: number | null;
  set1_team2: number | null;
  set2_team1: number | null;
  set2_team2: number | null;
  set3_team1: number | null;
  set3_team2: number | null;
  nextGameRef: number | null;
};

type RoundMap = { [round: string]: CupMatch[] };

function getRoundLabels(totalRounds: number): string[] {
  const labels = [
    '1/16e de finale',
    '1/8e de finale',
    '1/4 de finale',
    '1/2 finale',
    'Finale',
    'Vainqueur',
  ];
  return Array.from(
    { length: totalRounds },
    (_, i) => labels[totalRounds - i - 1] || `Tour ${totalRounds - i}`
  );
}

export const CupBracketTable = () => {
  const [rounds, setRounds] = useState<RoundMap>({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/cupgames`)
      .then((res) => res.json())
      .then((matches: CupMatch[]) => {
        const byNext = new Map<number, CupMatch[]>();
        matches.forEach((m) => {
          if (m.nextGameRef) {
            if (!byNext.has(m.nextGameRef)) byNext.set(m.nextGameRef, []);
            byNext.get(m.nextGameRef)!.push(m);
          }
        });

        const roundAssignments: { [round: string]: CupMatch[] } = {};
        const visited = new Set<number>();
        const roundIndexMap: Map<number, number> = new Map();

        let maxDepth = 0;

        function assignRound(id: number, depth: number) {
          if (visited.has(id)) return;
          visited.add(id);
          roundIndexMap.set(id, depth);
          maxDepth = Math.max(maxDepth, depth);
          const match = matches.find((m) => m.id === id);
          if (!match) return;
          byNext.get(id)?.forEach((prev) => assignRound(prev.id, depth + 1));
        }

        const final = matches.find((m) => !m.nextGameRef);
        if (final) assignRound(final.id, 0);

        const labels = getRoundLabels(maxDepth + 1);
        for (const match of matches) {
          const depth = roundIndexMap.get(match.id);
          if (depth === undefined) continue;
          const roundLabel = labels[depth];
          if (!roundAssignments[roundLabel]) roundAssignments[roundLabel] = [];
          roundAssignments[roundLabel].push(match);
        }

        setRounds(roundAssignments);
      });
  }, []);

  return (
    <div className="overflow-x-auto px-4">
      <div className="grid min-w-full auto-cols-min grid-flow-col justify-center gap-6">
        {Object.entries(rounds).map(([round, matches]) => (
          <div key={round} className="flex min-w-[180px] flex-col items-center">
            <h2 className="mb-3 text-center text-sm font-semibold">{round}</h2>
            {matches.map((m, i) => (
              <div
                key={i}
                className="bg-base-200 mb-4 flex h-28 w-40 flex-col justify-center rounded p-2 text-center text-sm shadow-inner"
              >
                <div className="text-xs">{m.date}</div>
                <div className={m.winner === m.team1 ? 'font-bold' : ''}>
                  {m.team1 || '—'}
                </div>
                <div className="my-1 flex flex-row justify-center gap-2">
                  {[1, 2, 3].map((setNum) => {
                    const t1 = m[`set${setNum}_team1` as keyof typeof m];
                    const t2 = m[`set${setNum}_team2` as keyof typeof m];
                    if (t1 === null && t2 === null)
                      return (
                        <div
                          key={setNum}
                          className="flex w-6 flex-col items-center"
                        >
                          <span className="text-xs text-gray-400">—</span>
                          <span className="text-xs text-gray-400">—</span>
                        </div>
                      );
                    return (
                      <div
                        key={setNum}
                        className="flex w-6 flex-col items-center"
                      >
                        <span className="text-xs">
                          {t1 !== null ? t1 : '—'}
                        </span>
                        <span className="text-xs">
                          {t2 !== null ? t2 : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className={m.winner === m.team2 ? 'font-bold' : ''}>
                  {m.team2 || '—'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default CupBracketTable;
