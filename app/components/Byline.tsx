import { formatLongDate, formatShortDate, hueFor, initials, isoDate } from '~/lib/text';

export function Avatar({ username, size }: { username: string; size?: 'lg' }) {
  return (
    <span
      className={size === 'lg' ? 'avatar avatar--lg' : 'avatar'}
      style={{ '--_h': hueFor(username) } as React.CSSProperties}
      aria-hidden="true"
    >
      {initials(username)}
    </span>
  );
}

interface BylineProps {
  username: string;
  date: Date | string;
  readingMinutes?: number;
  long?: boolean;
  avatar?: 'lg';
}

export function Byline({ username, date, readingMinutes, long, avatar }: BylineProps) {
  return (
    <p className="byline">
      {avatar ? <Avatar username={username} size={avatar} /> : <Avatar username={username} />}
      <span>
        By <strong>{username}</strong>
      </span>
      <span className="dot">
        <time dateTime={isoDate(date)}>{long ? formatLongDate(date) : formatShortDate(date)}</time>
      </span>
      {readingMinutes ? <span className="dot">{readingMinutes} min read</span> : null}
    </p>
  );
}
