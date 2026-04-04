import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Musculoskeletal 3D Epigenome Atlas. All
        rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
