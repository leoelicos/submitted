import { describe, expect, it } from 'vitest';
import { formToObject, parseWith, postSchema, signupSchema } from '~/lib/validation';

describe('signupSchema', () => {
  it('keeps the original 8 character minimum', () => {
    const result = parseWith(signupSchema, { username: 'leo', password: 'short' });
    expect(result).toEqual({
      ok: false,
      errors: { password: 'Password must be at least 8 characters.' },
    });
  });

  it('rejects usernames with spaces', () => {
    const result = parseWith(signupSchema, { username: 'leo wong', password: 'password12345' });
    expect(result.ok).toBe(false);
  });
});

describe('postSchema', () => {
  it('parses checkbox groups and optional category from FormData', () => {
    const form = new FormData();
    form.set('title', '  Hello ');
    form.set('summary', 'Summary');
    form.set('body', 'Body');
    form.set('categoryId', '');
    form.append('tagIds', '3');
    form.append('tagIds', '6');
    const result = parseWith(postSchema, formToObject(form, ['tagIds']));
    expect(result).toEqual({
      ok: true,
      data: {
        title: 'Hello',
        summary: 'Summary',
        body: 'Body',
        categoryId: undefined,
        tagIds: [3, 6],
      },
    });
  });

  it('reports one message per field', () => {
    const result = parseWith(postSchema, { title: '', summary: '', body: '', tagIds: [] });
    expect(result.ok).toBe(false);
    const errors = result.ok ? {} : result.errors;
    expect(Object.keys(errors).toSorted()).toEqual(['body', 'summary', 'title']);
  });
});
