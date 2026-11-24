import { useId, useRef } from 'react';
import { Form } from 'react-router';
import { TrashIcon } from './icons';

/**
 * Native <dialog> confirm: focus is trapped and restored by the browser, Esc
 * closes it. Without JS the trigger is a plain submit, so deletion still works
 * (just without the confirmation step).
 */
export function ConfirmDelete({
  action,
  title,
  label = 'Delete',
  className = 'button button--ghost button--small',
}: {
  action: string;
  title: string;
  label?: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  return (
    <Form
      method="post"
      action={action}
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter;
        if (submitter?.dataset.confirmed === 'true') {
          dialogRef.current?.close();
          return;
        }
        event.preventDefault();
        dialogRef.current?.showModal();
      }}
    >
      <input type="hidden" name="intent" value="delete" />
      <button type="submit" className={className}>
        <TrashIcon />
        {label}
        <span className="visually-hidden"> “{title}”</span>
      </button>
      <dialog ref={dialogRef} className="dialog" aria-labelledby={headingId}>
        <h2 id={headingId}>Delete “{title}”?</h2>
        <p>This removes the post, its tags and every comment on it. It can’t be undone.</p>
        <div className="button-row">
          <button
            type="button"
            className="button button--ghost"
            onClick={() => dialogRef.current?.close()}
          >
            Keep it
          </button>
          <button type="submit" className="button button--danger" data-confirmed="true">
            Yes, delete
          </button>
        </div>
      </dialog>
    </Form>
  );
}
