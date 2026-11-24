import { Form, Link } from 'react-router';
import { ErrorSummary, Field, FieldError, SubmitButton, type Errors } from './forms';
import { LIMITS } from '~/lib/validation';

interface Option {
  id: number;
  name: string;
}

export interface PostFormValues {
  title: string;
  summary: string;
  body: string;
  categoryId: number | null;
  tagIds: number[];
}

export function PostForm({
  categories,
  tags,
  values,
  errors,
  submitLabel,
  pendingLabel,
  cancelTo,
}: {
  categories: Option[];
  tags: Option[];
  values?: PostFormValues | undefined;
  errors: Errors;
  submitLabel: string;
  pendingLabel: string;
  cancelTo: string;
}) {
  const selected = new Set(values?.tagIds ?? []);
  return (
    <Form method="post" className="form card" noValidate>
      <ErrorSummary errors={errors} fieldIds={{ tagIds: 'tag-0' }} />
      <Field
        name="title"
        label="Title"
        hint="Make it punchy. The original posts riff on the assignment name."
        maxLength={LIMITS.title}
        defaultValue={values?.title}
        errors={errors}
      />
      <Field
        name="summary"
        label="Summary"
        hint="One or two sentences shown on the homepage card."
        multiline="short"
        maxLength={LIMITS.summary}
        defaultValue={values?.summary}
        errors={errors}
      />
      <Field
        name="body"
        label="Post"
        hint="Leave a blank line between paragraphs."
        multiline="long"
        maxLength={LIMITS.body}
        defaultValue={values?.body}
        errors={errors}
      />
      <div className="field">
        <label className="field__label" htmlFor="field-categoryId">
          Category <span className="muted">(optional)</span>
        </label>
        <select
          className="input"
          id="field-categoryId"
          name="categoryId"
          defaultValue={values?.categoryId ?? ''}
        >
          <option value="">Uncategorised</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="field" aria-describedby={errors?.tagIds ? 'tags-error' : 'tags-hint'}>
        <legend className="field__label">
          Tags <span className="muted">(optional, up to 8)</span>
        </legend>
        <p className="field__hint" id="tags-hint">
          Help classmates find your post.
        </p>
        <div className="check-chips">
          {tags.map((tag, i) => (
            <label className="check-chip" key={tag.id}>
              <input
                type="checkbox"
                name="tagIds"
                value={tag.id}
                id={`tag-${i}`}
                defaultChecked={selected.has(tag.id)}
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
        <FieldError id="tags-error" message={errors?.tagIds} />
      </fieldset>
      <div className="button-row">
        <SubmitButton pendingLabel={pendingLabel}>{submitLabel}</SubmitButton>
        <Link className="button button--ghost" to={cancelTo}>
          Cancel
        </Link>
      </div>
    </Form>
  );
}
