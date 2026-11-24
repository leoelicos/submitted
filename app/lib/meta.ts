export const SITE_NAME = 'Submitted!';
export const SITE_TAGLINE = 'The Bootcamp Student Blog';

export function pageMeta(title: string | null, description?: string) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} ${SITE_TAGLINE}`;
  const desc =
    description ??
    'Tips, tricks and war stories from full-stack coding bootcamp students: every assignment from Horiseon to Project 2.';
  return [
    { title: fullTitle },
    { name: 'description', content: desc },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: desc },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ];
}
