import { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar bg-base-200 shadow-sm">
        <div className="navbar-start">
          <h1 className="text-lg font-bold">A.S.I.E Volley</h1>
        </div>

        {/* Mobile hamburger button */}
        <div className="navbar-end lg:hidden">
          <button
            className="btn btn-ghost"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <section className="navbar-center hidden lg:flex">
          <MenuList />
        </section>
        <menu className="navbar-end hidden lg:flex"></menu>
      </nav>
      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="bg-base-200 top-full z-40 w-full lg:hidden">
          <MenuList mobile />
        </div>
      )}
    </>
  );
};

const MenuList = ({ mobile = false }: { mobile?: boolean }) => (
  <ul
    className={`menu ${mobile ? 'menu-vertical w-full items-center p-2 text-center' : 'menu-horizontal px-1'}`}
  >
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
        <ul className="bg-base-200 z-50 p-2 text-center">
          {[
            'Amadeus',
            'Ansys',
            'arm1',
            'arm2',
            'EURECOM',
            'FortiTeam',
            'Instant System 1',
            'Instant System 2',
            'MENTAp',
            'NXP1',
            'NXP2',
            'Renault-Ampere',
            'Thales',
          ].map((team) => (
            <li key={team}>
              <a href={`/team-calendar/${encodeURIComponent(team)}`}>{team}</a>
            </li>
          ))}
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
);

export default Navbar;
