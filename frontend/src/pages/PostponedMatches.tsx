import PostponedMatchesTable from '../components/tables/PostponedMatchesTable';
export const PostponedMatches = () => {
  return (
    <main className="flex min-h-[calc(100vh-142px)] flex-col items-center justify-center lg:flex-row">
      <section className="bg-base-100 p-8 lg:w-1/2">
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Matchs en attente de report
        </h2>
        <PostponedMatchesTable />
      </section>
      <section className="mx-auto max-w-full p-8 lg:w-1/2">
        <section className="bg-base-200 rounded-xl p-8 shadow">
          <h1 className="mb-6 text-center text-4xl font-bold">
            Règles de report
          </h1>
          <ol className="mb-6 list-inside list-decimal space-y-4 text-lg">
            <li>
              <span className="font-semibold">Définir la date :</span>
              Commencez par définir entre vous la date de report du match.
            </li>
            <li>
              <span className="font-semibold">Demander la mise à jour du calendrier:</span>
              Une fois que toutes les équipes concernées sont OK, envoyez un message sur le groupe WhatsApp dédié (<a href="Résultats de matchs et demandes de report">https://chat.whatsapp.com/Kd3oaujmVNv5qSZWIOzPXS</a>).
              Le calendrier sera mis à jour sur le site dès que possible.
              <br />
            </li>
          </ol>
          <div className="bg-warning/20 border-warning text-warning-800 rounded border-l-4 px-4 py-3 text-base">
            <span className="font-semibold">Important :</span> La demande de
            décalage doit nous parvenir le plus tôt possible, et au plus tard
            <span className="font-bold">LA VEILLE</span> du match.
            <br />
            Tout décalage demandé le jour du match sera
            <span className="font-bold">refusé</span>.
          </div>
        </section>
      </section>
    </main>
  );
};

export default PostponedMatches;
