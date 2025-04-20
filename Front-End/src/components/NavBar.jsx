import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/tickets", label: "Create Ticket" },
  { path: "/profile", label: "User" },
];

function NavBar() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const handleNavLinkClick = (path) => {
    setActivePath(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div id="navbarRoot">
      <div id="header">
        <div id="navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              className="link"
              to={item.path}
              onClick={() => handleNavLinkClick(item.path)}
            >
              <p className={activePath === item.path ? "selectedNavigation" : ""}>
                {item.label}
              </p>
            </Link>
          ))}
        </div>
        <Link className="link" to="/">
          <p id="name">Ticket App</p>
        </Link>
        {/* burger menu for smaller screens */}
        <div id="burger-menu" onClick={toggleMenu}>
          <div id="burgerContainer">
            <div className={`burger ${isMenuOpen ? "open" : ""}`}></div>
            <div className={`burger ${isMenuOpen ? "open" : ""}`}></div>
            <div className={`burger ${isMenuOpen ? "open" : ""}`}></div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div id="mobile-menu" className={isMenuOpen ? "open" : ""}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            className="link"
            to={item.path}
            onClick={() => {
              handleNavLinkClick(item.path);
              setIsMenuOpen(false); // Close menu after clicking
            }}
          >
            <p className={activePath === item.path ? "selectedNavigation" : ""}>
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NavBar;