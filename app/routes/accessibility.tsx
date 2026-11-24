import { Link } from 'react-router';
import { pageMeta } from '~/lib/meta';

export const meta = () => pageMeta('Accessibility statement');

export default function Accessibility() {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Statement</p>
        <h1>Accessibility</h1>
        <p>Submitted! aims to meet WCAG 2.2 at level AA, and AAA for text contrast.</p>
      </header>
      <div className="prose-page stack">
        <h2>What we do</h2>
        <ul>
          <li>
            Semantic landmarks, a skip link and one <code>h1</code> per page.
          </li>
          <li>Every page and form works without JavaScript; JavaScript only enhances.</li>
          <li>
            Focus moves to the new page heading after client-side navigation, and the page title is
            announced.
          </li>
          <li>
            Body and secondary text meet 7:1 contrast in both light and dark themes; this is
            enforced by an automated test.
          </li>
          <li>
            Visible focus indicators, 24px+ targets, and no information conveyed by colour alone.
          </li>
          <li>
            Form errors are summarised, linked to their fields and announced; inputs keep their
            values.
          </li>
          <li>Password fields support password managers, paste and a show/hide toggle.</li>
          <li>
            All motion respects <code>prefers-reduced-motion</code>; notifications can be dismissed
            and pause on hover or focus.
          </li>
          <li>Pages are tested with axe-core on every change in CI.</li>
        </ul>
        <h2>Found a barrier?</h2>
        <p>
          Please <a href="https://github.com/leoelicos/submitted/issues">open an issue on GitHub</a>{' '}
          describing the page and what happened. Or head back to the <Link to="/">homepage</Link>.
        </p>
      </div>
    </div>
  );
}
