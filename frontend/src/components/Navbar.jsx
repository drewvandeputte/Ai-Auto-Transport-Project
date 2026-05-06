// ============================================================
// AutoRoute AI — Navigation Bar
// ============================================================

import { useState } from 'react';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function Navbar({ onLogoClick, onAbout, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleGetQuote() {
    setMenuOpen(false);
    if (currentPage !== 'home') {
      onLogoClick();
      setTimeout(() => scrollToSection('get-a-quote'), 100);
    } else {
      scrollToSection('get-a-quote');
    }
  }

  function handleHowItWorks() {
    setMenuOpen(false);
    if (currentPage !== 'home') {
      onLogoClick();
      setTimeout(() => scrollToSection('how-it-works'), 100);
    } else {
      scrollToSection('how-it-works');
    }
  }

  function handleAbout() {
    setMenuOpen(false);
    onAbout();
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
        AutoRoute <span>AI</span>
      </div>

      {/* Desktop links */}
      <div className="navbar-links">
        <button className="nav-link" onClick={handleGetQuote}>Get a Quote</button>
        <button className="nav-link" onClick={handleHowItWorks}>How It Works</button>
        <button className="nav-link" onClick={handleAbout}>About Us</button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-dropdown">
          <button className="nav-dropdown-link" onClick={handleGetQuote}>Get a Quote</button>
          <button className="nav-dropdown-link" onClick={handleHowItWorks}>How It Works</button>
          <button className="nav-dropdown-link" onClick={handleAbout}>About Us</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
