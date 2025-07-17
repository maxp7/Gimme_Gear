import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="text-center text-sm text-black py-4 mt-20">
    <p>&copy; 2025 Gimme Gear – Ein Ausleihesystem der HTW</p>
    <p className="mt-2">
      <Link to="./components/legal/Impressum" className="mr-4 underline">Impressum</Link>
      <Link to="./components/legal/datenschutz" className="underline">Datenschutzerklärung</Link>
    </p>
  </footer>
);

export default Footer;
