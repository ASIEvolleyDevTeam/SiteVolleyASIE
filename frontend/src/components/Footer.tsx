export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content text-center text-sm">
      <p>
        Site développé par <span className="font-semibold">Frédéric KAH</span> —
        ASIE Volley © {new Date().getFullYear()}
      </p>
    </footer>
  );
};
export default Footer;
