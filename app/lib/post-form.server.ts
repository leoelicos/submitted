import { data } from 'react-router';
import { formToObject, parseWith, postSchema } from './validation';

/** Shared create/edit parsing: returns validated input or a 400 with errors + echoed values. */
export async function parsePostForm(request: Request) {
  const form = await request.formData();
  const raw = formToObject(form, ['tagIds']);
  const parsed = parseWith(postSchema, raw);
  if (parsed.ok) return { ok: true as const, input: parsed.data };
  const categoryId = Number(raw.categoryId);
  return {
    ok: false as const,
    response: data(
      {
        errors: parsed.errors,
        values: {
          title: String(raw.title ?? ''),
          summary: String(raw.summary ?? ''),
          body: String(raw.body ?? ''),
          categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null,
          tagIds: (Array.isArray(raw.tagIds) ? raw.tagIds : [])
            .map(Number)
            .filter(Number.isInteger),
        },
      },
      { status: 400 },
    ),
  };
}
