// ============================================================
// AutoRoute AI — Navigation Bar
// ============================================================

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function Navbar({ onLogoClick, onAbout, currentPage }) {

  function handleGetQuote() {
    if (currentPage !== 'home') {
      onLogoClick();
      setTimeout(() => scrollToSection('get-a-quote'), 100);
    } else {
      scrollToSection('get-a-quote');
    }
  }

  function handleHowItWorks() {
    if (currentPage !== 'home') {
      onLogoClick();
      setTimeout(() => scrollToSection('how-it-works'), 100);
    } else {
      scrollToSection('how-it-works');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
        AutoRoute <span>AI</span>
      </div>
      <div className="navbar-links">
        <button className="nav-link" onClick={handleGetQuote}>Get a Quote</button>
        <button className="nav-link" onClick={handleHowItWorks}>How It Works</button>
        <button className="nav-link" onClick={onAbout}>About Us</button>
      </div>
    </nav>
  );
}

export default Navbar;
