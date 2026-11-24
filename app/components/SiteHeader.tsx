import { Form, Link, NavLink } from 'react-router';
import type { SessionUser, Theme } from '~/lib/session.server';
import { LogoMark } from './icons';
import { ThemeSwitch } from './ThemeSwitch';

export function SiteHeader({ user, theme }: { user: SessionUser | null; theme: Theme }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Submitted! home">
          <LogoMark className="brand__mark" />
          <span aria-hidden="true">
            Submitted<span className="brand__bang">!</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <ul role="list">
            <li>
              <NavLink to="/" end className="nav-link">
                Homepage
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li>
              {user ? (
                <Form method="post" action="/logout">
                  <button type="submit" className="nav-link">
                    Log out<span className="visually-hidden"> {user.username}</span>
                  </button>
                </Form>
              ) : (
                <NavLink to="/login" className="nav-link">
                  Log in
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
        <ThemeSwitch theme={theme} />
      </div>
    </header>
  );
}
