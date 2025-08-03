export const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <h1 className="navbar-start">A.S.I.E Volley</h1>
      <section className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/ranking">Classement</a>
          </li>
          <li>
            <a href="/global-calendar">Calendrier Global</a>
          </li>
          <li>
            <details>
              <summary>Calendriers d'équipe</summary>
              <ul className="z-50 p-2">
                <li>
                  <a href="/team-calendar/Amadeus">Amadeus</a>
                </li>
                <li>
                  <a href="/team-calendar/Ansys">Ansys</a>
                </li>
                <li>
                  <a href="/team-calendar/arm1">arm1</a>
                </li>
                <li>
                  <a href="/team-calendar/arm2">arm2</a>
                </li>
                <li>
                  <a href="/team-calendar/EURECOM">EURECOM</a>
                </li>
                <li>
                  <a href="/team-calendar/FortiTeam">FortiTeam</a>
                </li>
                <li>
                  <a href="/team-calendar/Instant System 1">Instant System 1</a>
                </li>
                <li>
                  <a href="/team-calendar/Instant System 2">Instant System 2</a>
                </li>
                <li>
                  <a href="/team-calendar/MENTAp">MENTAp</a>
                </li>
                <li>
                  <a href="/team-calendar/NXP1">NXP1</a>
                </li>
                <li>
                  <a href="/team-calendar/NXP2">NXP2</a>
                </li>
                <li>
                  <a href="/team-calendar/Renault-Ampere">Renault-Ampere</a>
                </li>
                <li>
                  <a href="/team-calendar/Thales">Thales</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a href="/results">Résultats</a>
          </li>
          <li>
            <a href="/postponed-matches">Matchs reportés</a>
          </li>
          <li>
            <a href="/asie-cup">A.S.I.E. Cup</a>
          </li>
          <li>
            <a href="/championship-rules">Règles du championnat</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </section>
      <menu className="navbar-end"></menu>
    </nav>
  );
};

export default Navbar;
