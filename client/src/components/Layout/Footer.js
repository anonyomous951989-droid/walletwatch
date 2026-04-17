import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="footer p-3">
        <h4 className="text-center">
          All rights reserved &copy; 2025 RD
        </h4>
        <p className="text-center mt-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="#About"
          >
            About
          </a>
          |<Link to="/contact-us">Contact</Link>|
          <Link to="/privacy-policy">Privacy Policy</Link>|
          Made with &#10084; by RD
        </p>
      </div>
    </>
  );
};

export default Footer;
