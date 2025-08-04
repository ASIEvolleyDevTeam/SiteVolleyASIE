import PostponedMatchesTable from '../components/tables/PostponedMatchesTable';
export const PostponedMatches = () => {
  return (
    <main className="flex min-h-[calc(100vh-85px)] flex-col items-center justify-center lg:flex-row">
      <section className="bg-base-100 p-8 lg:w-1/2">
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Matches en attente de report
        </h2>
        <PostponedMatchesTable />
      </section>
      <section className="mx-auto flex flex-col p-8 lg:w-1/2">
        <section className="bg-base-200 rounded-xl p-8 shadow">
          <h1 className="mb-6 text-center text-4xl font-bold">
            Règles de report
          </h1>
          <ol className="mb-6 list-inside list-decimal space-y-4 text-lg">
            <li>
              <span className="font-semibold">Définir les dates :</span>{' '}
              Commencez par définir entre vous les dates de reports (il va
              probablement falloir échanger avec un autre match).
            </li>
            <li>
              <span className="font-semibold">
                Envoyer un mail récapitulatif :
              </span>{' '}
              Une fois que toutes les équipes concernées sont OK, faire un mail
              récapitulatif (et succinct !) à{' '}
              <a
                href="mailto:asievolley06+reports@googlegroups.com"
                className="underline"
              >
                asievolley06+reports@googlegroups.com
              </a>
              , en mettant en copie les capitaines de toutes les équipes
              concernées.
              <br />
              <span className="text-sm italic">
                Ce mail ne doit pas engager une nouvelle discussion concernant
                le report, sinon il sera ignoré.
              </span>
            </li>
          </ol>
          <div className="bg-warning/20 border-warning text-warning-800 rounded border-l-4 px-4 py-3 text-base">
            <span className="font-semibold">Important :</span> La demande de
            décalage doit nous parvenir le plus tôt possible, et au plus tard{' '}
            <span className="font-bold">LA VEILLE</span> du match.
            <br />
            Tout décalage demandé le jour du match sera{' '}
            <span className="font-bold">refusé</span>.
          </div>
        </section>
      </section>
    </main>
  );
};

export default PostponedMatches;
