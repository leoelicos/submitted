import { Link } from 'react-router';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          <strong>Submitted!</strong> The Bootcamp Student Blog. Built in 2022 at bootcamp, rebuilt
          in 2026.
          <br />© Leo Wong. MIT licensed.
        </p>
        <nav aria-label="Footer">
          <ul role="list">
            <li>
              <Link to="/accessibility">Accessibility</Link>
            </li>
            <li>
              <a href="https://github.com/leoelicos/submitted">Source on GitHub</a>
            </li>
            <li>
              <Link to="/api/blog" reloadDocument>
                JSON API
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
