import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useNavigation } from 'react-router';
import { AlertIcon } from './icons';

export type Errors = Partial<Record<string, string>> | undefined;

interface FieldProps {
  name: string;
  label: string;
  errors?: Errors;
  hint?: ReactNode;
  defaultValue?: string | undefined;
  maxLength?: number;
  required?: boolean;
  type?: 'text' | 'search';
  multiline?: 'short' | 'long';
  autoComplete?: string;
  spellCheck?: boolean;
  /** Override the generated id when the same field name appears twice on a page. */
  id?: string;
}

function describedBy(...ids: (string | false | undefined)[]) {
  const value = ids.filter(Boolean).join(' ');
  return value || undefined;
}

export function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id}>
      <AlertIcon />
      <span>
        <span className="visually-hidden">Error: </span>
        {message}
      </span>
    </p>
  );
}

/**
 * Labelled input/textarea with hint, inline error and a polite character
 * counter. The counter is only announced when nearing the limit so screen
 * readers aren't spammed on every keystroke.
 */
export function Field({
  name,
  label,
  errors,
  hint,
  defaultValue = '',
  maxLength,
  required = true,
  type = 'text',
  multiline,
  autoComplete,
  spellCheck,
  id: idOverride,
}: FieldProps) {
  const id = idOverride ?? `field-${name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const error = errors?.[name];
  const [length, setLength] = useState(defaultValue.length);
  const nearLimit = maxLength ? length >= maxLength * 0.9 : false;

  const common = {
    id,
    name,
    className: multiline ? `input${multiline === 'short' ? ' input--short' : ''}` : 'input',
    defaultValue,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(
      hint ? hintId : undefined,
      maxLength ? counterId : undefined,
      error ? errorId : undefined,
    ),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setLength(event.currentTarget.value.length),
    ...(autoComplete ? { autoComplete } : {}),
    ...(spellCheck !== undefined ? { spellCheck } : {}),
  };

  return (
    <div className="field">
      <div className="field__row">
        <label className="field__label" htmlFor={id}>
          {label}
          {required ? null : <span className="muted"> (optional)</span>}
        </label>
        {maxLength ? (
          <span
            className="field__counter mono"
            id={counterId}
            data-over={length > maxLength}
            aria-live={nearLimit ? 'polite' : 'off'}
          >
            {length.toLocaleString('en-AU')} / {maxLength.toLocaleString('en-AU')}
            <span className="visually-hidden"> characters</span>
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {multiline ? (
        <textarea {...common} rows={multiline === 'short' ? 3 : 10} />
      ) : (
        <input {...common} type={type} />
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function PasswordField({
  name,
  label,
  errors,
  autoComplete,
  hint,
  id: idOverride,
}: {
  id?: string;
  name: string;
  label: string;
  errors?: Errors;
  autoComplete: 'current-password' | 'new-password';
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const base = useId();
  const id = idOverride ?? `${base}-${name}`;
  const error = errors?.[name];
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      <div className="password">
        <input
          className="input"
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          minLength={autoComplete === 'new-password' ? 8 : undefined}
          spellCheck={false}
          autoCapitalize="none"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hint && `${id}-hint`, error && `${id}-error`)}
        />
        <button
          type="button"
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'Hide' : 'Show'}
          <span className="visually-hidden"> password</span>
        </button>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/**
 * GOV.UK-style error summary: receives focus after a failed submit so keyboard
 * and screen-reader users land on the list of problems, each linking to its field.
 */
export function ErrorSummary({
  errors,
  fieldIds,
  title = 'There is a problem',
}: {
  errors: Errors;
  fieldIds?: Record<string, string>;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const entries = Object.entries(errors ?? {}).filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  );
  const key = entries.map(([k, v]) => k + v).join('|');

  useEffect(() => {
    if (key) ref.current?.focus();
  }, [key]);

  if (!entries.length) return null;
  return (
    <div className="error-summary" ref={ref} tabIndex={-1} role="group" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <ul>
        {entries.map(([field, message]) => (
          <li key={field}>
            {field === 'form' ? (
              message
            ) : (
              <a
                href={`#${fieldIds?.[field] ?? `field-${field}`}`}
                onClick={(event) => {
                  // Focus the field without a hash navigation (which would clear actionData).
                  const target = document.getElementById(fieldIds?.[field] ?? `field-${field}`);
                  if (!target) return;
                  event.preventDefault();
                  target.focus();
                  target.scrollIntoView({ block: 'center' });
                }}
              >
                {message}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Submit button that reflects pending state without losing focus or becoming unfocusable. */
export function SubmitButton({
  children,
  pendingLabel,
  intent,
  className = 'button',
}: {
  children: ReactNode;
  pendingLabel: string;
  intent?: string;
  className?: string;
}) {
  const navigation = useNavigation();
  const pending =
    navigation.state === 'submitting' &&
    (intent === undefined || navigation.formData?.get('intent') === intent);
  return (
    <button
      className={className}
      type="submit"
      aria-disabled={pending || undefined}
      onClick={(event) => {
        if (pending) event.preventDefault();
      }}
      {...(intent ? { name: 'intent', value: intent } : {})}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
