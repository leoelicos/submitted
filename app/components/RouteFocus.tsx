import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

/**
 * Client-side navigation accessibility (Marcy Sutton's research, linked from the
 * React Router a11y docs): after a pathname change, move focus to the new page's
 * <h1> and announce the document title. Search-param changes (filters) and
 * in-page #hash jumps leave focus where the browser puts it.
 */
export function RouteFocus() {
  const location = useLocation();
  const previous = useRef(location.pathname);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (previous.current === location.pathname) return;
    previous.current = location.pathname;
    if (location.hash) return;
    const frame = requestAnimationFrame(() => {
      const target =
        document.querySelector<HTMLElement>('main h1') ?? document.getElementById('main');
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
      setMessage(document.title);
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);

  return (
    <div className="visually-hidden" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
