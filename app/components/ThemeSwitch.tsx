import { useFetcher } from 'react-router';
import type { Theme } from '~/lib/session.server';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'System', Icon: MonitorIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
] as const;

/**
 * A real radio group (arrow keys work natively) that persists to a cookie so the
 * server renders the right scheme on the first byte: no flash, no inline script.
 * Without JS the noscript button submits the same form.
 */
export function ThemeSwitch({ theme }: { theme: Theme }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/theme" key={theme}>
      <fieldset className="theme-switch">
        <legend className="visually-hidden">Colour theme</legend>
        {OPTIONS.map(({ value, label, Icon }) => (
          <label key={value} title={label}>
            <input
              type="radio"
              name="theme"
              value={value}
              defaultChecked={theme === value}
              onChange={(event) => {
                // Apply instantly; the cookie round-trip makes it stick for SSR.
                const root = document.documentElement;
                if (value === 'system') delete root.dataset.theme;
                else root.dataset.theme = value;
                void fetcher.submit(event.currentTarget.form);
              }}
            />
            <Icon />
            <span className="visually-hidden">{label}</span>
          </label>
        ))}
        <noscript>
          <button type="submit" className="button button--small">
            Apply
          </button>
        </noscript>
      </fieldset>
    </fetcher.Form>
  );
}
