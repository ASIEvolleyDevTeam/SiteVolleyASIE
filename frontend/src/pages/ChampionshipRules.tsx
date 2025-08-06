export const ChampionshipRules = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Règles du Championnat A.S.I.E. VOLLEY
      </h1>

      <section className="bg-base-200 mb-6 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Déroulement des matchs
        </h2>
        <p className="mb-2">
          Les matchs ont lieu à 12h15 les lundi et jeudis au gymnase du CIV. Une
          équipe qui n'est pas prête à jouer à 12:30 sera déclarée forfait.
        </p>
        <p className="mb-2">
          Les règles classiques du volley en salle s'appliquent avec quelques
          différences :
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
          respecter les autres équipes dans un esprit fairplay.
        </p>
      </section>

      <section className="bg-base-200 mb-6 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Report de matchs
        </h2>
        <p>
          Chaque équipe doit vérifier à l'avance si elle peut être présente à
          ses matchs. Si besoin, elle peut demander un report en contactant
          l'équipe adverse et l'arbitre (copie à asievolley06@googlegroups.com).
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
              <tr>
                <td>Arbitrage manqué</td>
                <td className="text-center">-1 point</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-base-200 rounded-xl p-6 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">Résultats</h2>
        <p className="mb-2">
          Les résultats doivent être envoyés à asievolley06@googlegroups.com
          avec copie à l'équipe adverse et à l'arbitre. Le message doit inclure
          :
        </p>
        <ul className="mb-2 list-inside list-disc">
          <li>Le nom des équipes</li>
          <li>Les noms des joueurs des deux équipes</li>
          <li>Le score des sets</li>
        </ul>
        <p>
          Les résultats sont régulièrement mis à jour et publiés sur le site.
        </p>
      </section>
    </main>
  );
};

export default ChampionshipRules;
