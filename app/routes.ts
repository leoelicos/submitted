import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('blog/:id', 'routes/post.tsx'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  route('theme', 'routes/theme.ts'),
  route('accessibility', 'routes/accessibility.tsx'),
  ...prefix('dashboard', [
    index('routes/dashboard.tsx'),
    route('new', 'routes/dashboard.new.tsx'),
    route(':id/edit', 'routes/dashboard.edit.tsx'),
  ]),
  ...prefix('api', [
    route('blog', 'routes/api.blog.ts'),
    route('blog/:id', 'routes/api.blog.$id.ts'),
    route('category', 'routes/api.category.ts'),
    route('tag', 'routes/api.tag.ts'),
  ]),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
