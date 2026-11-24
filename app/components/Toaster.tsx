import { useEffect, useState } from 'react';
import type { Toast } from '~/lib/session.server';
import { CloseIcon } from './icons';

const VISIBLE_MS = 8000;
const STAMP_MS = 2000;

/**
 * Flash messages from the server. The live region is always mounted (so screen
 * readers reliably announce new content), dismissable, and the auto-hide timer
 * pauses while hovered or focused (WCAG 2.2.1 Timing Adjustable).
 */
export function Toaster({ toast }: { toast: Toast | null }) {
  const [dismissed, setDismissed] = useState<Toast | null>(null);
  const [stampDone, setStampDone] = useState<Toast | null>(null);
  const [paused, setPaused] = useState(false);
  const visible = toast && toast !== dismissed ? toast : null;
  const showStamp = Boolean(toast?.stamp && toast !== stampDone);

  useEffect(() => {
    if (!visible || paused) return;
    const id = window.setTimeout(() => setDismissed(visible), VISIBLE_MS);
    return () => window.clearTimeout(id);
  }, [visible, paused]);

  useEffect(() => {
    if (!showStamp || !toast) return;
    const id = window.setTimeout(() => setStampDone(toast), STAMP_MS);
    return () => window.clearTimeout(id);
  }, [showStamp, toast]);

  return (
    <>
      <section className="toaster" aria-label="Notifications">
        <div role="status" aria-live="polite" aria-atomic="true">
          {visible ? (
            <div
              className="toast"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <strong>{visible.title}</strong>
              {visible.message ? <p>{visible.message}</p> : null}
              <button type="button" onClick={() => setDismissed(visible)}>
                <CloseIcon width={18} height={18} />
                <span className="visually-hidden">Dismiss notification</span>
              </button>
            </div>
          ) : null}
        </div>
      </section>
      {showStamp ? (
        <div className="stamp-overlay" aria-hidden="true">
          <span className="stamp">
            Submitted!
            <small>On time · A+</small>
          </span>
        </div>
      ) : null}
    </>
  );
}
