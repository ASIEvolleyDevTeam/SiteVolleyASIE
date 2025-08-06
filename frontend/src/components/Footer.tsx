export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-4 text-center text-sm">
      <p>
        Site développé par <span className="font-semibold">Frédéric KAH</span> —
        ASIE Volley © {new Date().getFullYear()}
      </p>
      <div className="mt-1 space-x-4">
        <a
          href="https://www.linkedin.com/in/fr%C3%A9d%C3%A9ric-kah-7213a1354/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="https://frkah.github.io/webdev_site_portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Portfolio
        </a>
      </div>
    </footer>
  );
};

export default Footer;
