import { z } from 'zod';

export const LIMITS = {
  usernameMin: 3,
  usernameMax: 32,
  passwordMin: 8,
  passwordMax: 128,
  title: 160,
  summary: 280,
  body: 20_000,
  comment: 2_000,
} as const;

const trimmed = (label: string, max: number) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, { error: `${label} is required.` })
    .max(max, { error: `${label} must be ${max.toLocaleString('en-AU')} characters or fewer.` });

export const signupSchema = z.object({
  username: z
    .string({ error: 'Username is required.' })
    .trim()
    .min(LIMITS.usernameMin, {
      error: `Username must be at least ${LIMITS.usernameMin} characters.`,
    })
    .max(LIMITS.usernameMax, {
      error: `Username must be ${LIMITS.usernameMax} characters or fewer.`,
    })
    .regex(/^[A-Za-z0-9_.-]+$/, {
      error: 'Username can only use letters, numbers, dots, dashes and underscores.',
    }),
  password: z
    .string({ error: 'Password is required.' })
    .min(LIMITS.passwordMin, {
      error: `Password must be at least ${LIMITS.passwordMin} characters.`,
    })
    .max(LIMITS.passwordMax, {
      error: `Password must be ${LIMITS.passwordMax} characters or fewer.`,
    }),
});

export const loginSchema = z.object({
  username: trimmed('Username', LIMITS.usernameMax),
  password: z.string({ error: 'Password is required.' }).min(1, { error: 'Password is required.' }),
});

const optionalId = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().positive().optional(),
);

export const postSchema = z.object({
  title: trimmed('Title', LIMITS.title),
  summary: trimmed('Summary', LIMITS.summary),
  body: trimmed('Post body', LIMITS.body),
  categoryId: optionalId,
  tagIds: z.array(z.coerce.number().int().positive()).max(8, { error: 'Pick up to 8 tags.' }),
});

export const commentSchema = z.object({
  body: trimmed('Comment', LIMITS.comment),
});

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export type ParseResult<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors<T> };

/** Validate FormData-shaped input and flatten zod issues to one message per field. */
export function parseWith<S extends z.ZodType>(
  schema: S,
  input: unknown,
): ParseResult<z.output<S>> {
  const result = schema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] ??= issue.message;
  }
  return { ok: false, errors: errors as FieldErrors<z.output<S>> };
}

/** Convert FormData into a plain object; repeated keys (checkbox groups) become arrays. */
export function formToObject(form: FormData, arrayKeys: readonly string[] = []) {
  const out: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const key of new Set(form.keys())) {
    out[key] = arrayKeys.includes(key) ? form.getAll(key) : (form.get(key) ?? '');
  }
  for (const key of arrayKeys) out[key] ??= [];
  return out;
}
