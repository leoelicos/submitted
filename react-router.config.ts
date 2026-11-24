import type { Config } from '@react-router/dev/config';

export default {
  // Server-render every route so forms work before (and without) JavaScript.
  ssr: true,
} satisfies Config;
