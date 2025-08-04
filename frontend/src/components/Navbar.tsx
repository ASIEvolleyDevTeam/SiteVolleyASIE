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
    className={`menu ${mobile ? 'menu-vertical w-full items-center p-2' : 'menu-horizontal px-1'}`}
  >
    <li className={mobile ? 'w-full' : ''}>
      <a className={mobile ? 'w-full justify-center' : ''} href="/">
        Home
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a className={mobile ? 'w-full justify-center' : ''} href="/ranking">
        Classement
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a
        className={mobile ? 'w-full justify-center' : ''}
        href="/global-calendar"
      >
        Calendrier Global
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <details>
        <summary className={mobile ? 'w-full justify-center' : ''}>
          Calendriers d'équipe
        </summary>
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
              <a
                className={mobile ? 'w-full justify-center' : ''}
                href={`/team-calendar/${encodeURIComponent(team)}`}
              >
                {team}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a className={mobile ? 'w-full justify-center' : ''} href="/results">
        Résultats
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a
        className={mobile ? 'w-full justify-center' : ''}
        href="/postponed-matches"
      >
        Matchs reportés
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a className={mobile ? 'w-full justify-center' : ''} href="/asie-cup">
        A.S.I.E. Cup
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a
        className={mobile ? 'w-full justify-center' : ''}
        href="/championship-rules"
      >
        Règles du championnat
      </a>
    </li>
    <li className={mobile ? 'w-full' : ''}>
      <a className={mobile ? 'w-full justify-center' : ''} href="/contact">
        Contact
      </a>
    </li>
  </ul>
);

export default Navbar;
