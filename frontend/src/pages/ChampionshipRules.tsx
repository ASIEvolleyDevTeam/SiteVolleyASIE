export const ChampionshipRules = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Règles du Championnat A.S.I.E. VOLLEY
      </h1>

      <section className="bg-base-200 mb-6 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Heures et locaux
        </h2>
        <p className="mb-2">
          Les matchs ont lieu à 12h15 les lundi et jeudis au gymnase du CIV. Une
          équipe qui n'est pas prête à jouer à 12h30 sera déclarée forfait.
          Le gymnase est réservé à l'ASIE Volley jusqu'à 13h15 les lundis, et jusqu'à 13h les mardis et jeudis.
          Merci de libérer le gymnase dès que les professeurs et élèves du lycée en ont besoin, pour conserver nos
          bonnes relations avec eux et avec la mairie de Valbonne!
        </p>
        <p className="mb-2">Deux vestiaires sont à votre disposition&nbsp;:</p>
        <ul className="mb-2 ml-6 list-disc">
          <li>à l'étage supérieur, le vestiaire Professeurs est réservé aux joueuses.</li>
          <li>à l'étage intermédiaire, le vestiaire numéro 7 est ouvert aux joueurs.</li>
        </ul>
        <h2 className="mb-4 text-center text-2xl font-bold">
          Déroulement des matchs
        </h2>
        <p className="mb-2">
          Les règles classiques du volley en salle s'appliquent avec quelques
          différences&nbsp;:
        </p>
        <ul className="mb-2 ml-6 list-disc">
          <li>Chaque équipe est constituée de 4 joueurs</li>
          <li>Il n'y a ni faute de position ni de "joueur arrière"</li>
          <li>
            Les matchs se jouent en deux sets gagnants de 25 points avec 2
            points d'écart
          </li>
        </ul>
        <p>
          En cas d'égalité, un troisième set de 15 points est joué avec 2 points
          d'écart. Si interrompu, un set terminé aux deux tiers compte. Sinon,
          le point average détermine le vainqueur.
        </p>
      </section>

      <section className="bg-base-200 mb-6 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">Esprit</h2>
        <p>
          Le but principal de la compétition A.S.I.E. est de s'amuser. Merci de
          respecter les autres équipes dans un esprit fairplay. C'est d'autant plus 
          important que les matchs sont auto-arbitrés!
        </p>
      </section>

      <section className="bg-base-200 mb-6 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Report de matchs
        </h2>
        <p>
          Chaque équipe doit vérifier à l'avance si elle peut être présente à
          ses matchs. Si besoin, elle peut demander un report en contactant
          l'équipe adverse et l'arbitre (de préférence sur le groupe WhatsApp, ou par email).
          Elle est responsable de trouver une solution.
        </p>
      </section>

      <section className="bg-base-200 mb-6 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Points / Pénalités
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Résultat</th>
                <th className="text-center">Points / Pénalité</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Victoire</td>
                <td className="text-center">3 points</td>
              </tr>
              <tr>
                <td>Défaite 2:1 ou 1:1</td>
                <td className="text-center">2 points</td>
              </tr>
              <tr>
                <td>Défaite 2:0</td>
                <td className="text-center">1 point</td>
              </tr>
              <tr>
                <td>Défaite par forfait</td>
                <td className="text-center">0 points</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-base-200 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">Résultats</h2>
        <p className="mb-2">
          Les résultats doivent être envoyés sur le groupe WhatsApp (<a href="https://chat.whatsapp.com/Kd3oaujmVNv5qSZWIOzPXS">Résultats de matchs et demandes de report</a>).
          Le message doit inclure&nbsp;:
        </p>
        <ul className="mb-2 list-inside list-disc">
          <li>Le nom des équipes</li>
          <li>Le score des sets</li>
          <li>Toute information méritant d'être transmise aux organisateurs (blessures, difficultés quelconques...)</li>
        </ul>
        <p>
          Les résultats sont régulièrement mis à jour et publiés sur le site.
        </p>
      </section>
    </main>
  );
};

export default ChampionshipRules;
