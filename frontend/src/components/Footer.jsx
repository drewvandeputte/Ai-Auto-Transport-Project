// ============================================================
// AutoRoute AI — Footer
// ============================================================

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        AutoRoute <span>AI</span>
      </div>
      <p className="footer-text">
        © {new Date().getFullYear()} AutoRoute AI. Demo product — not yet licensed for live bookings.
      </p>
    </footer>
  );
}

export default Footer;
