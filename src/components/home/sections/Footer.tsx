import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">
          <span className="logo-text">ARK</span>
          <span className="logo-text-sub">STUDIO</span>
        </div>
        <p className="footer-tagline">
          Developed with ❤️ by one developer for video editors everywhere
        </p>
        <div className="copyright">© 2025 ARK Studio. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
