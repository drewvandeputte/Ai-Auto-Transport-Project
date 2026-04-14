// ============================================================
// AutoRoute AI — Navigation Bar
// ============================================================
// onLogoClick resets the app to the home page when clicked.

function Navbar({ onLogoClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
        AutoRoute <span>AI</span>
      </div>
      <div className="navbar-tagline">
        AI-Powered Auto Transport
      </div>
    </nav>
  );
}

export default Navbar;
