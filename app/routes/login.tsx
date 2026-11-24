import { data, Form, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/login';
import { ErrorSummary, Field, PasswordField, SubmitButton } from '~/components/forms';
import { getDb, isDemoDatabase } from '~/lib/db.server';
import { pageMeta } from '~/lib/meta';
import { createUser, usernameTaken, verifyLogin } from '~/lib/queries.server';
import { DEMO_PASSWORD, seedUsers } from '~/lib/seed-data';
import { redirectWithToast, userContext } from '~/lib/session.server';
import { safeRedirect } from '~/lib/text';
import { loginSchema, parseWith, signupSchema } from '~/lib/validation';

export const meta = () => pageMeta('Log in or sign up');

export function loader({ request, context }: Route.LoaderArgs) {
  const redirectTo = safeRedirect(
    new URL(request.url).searchParams.get('redirectTo'),
    '/dashboard',
  );
  // If the user is already logged in, skip straight to where they were going.
  if (context.get(userContext)) throw redirect(redirectTo);
  return { redirectTo, demoUser: isDemoDatabase() ? (seedUsers[0] ?? null) : null };
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const intent = form.get('intent');
  const redirectTo = safeRedirect(form.get('redirectTo'), '/dashboard');
  const db = await getDb();

  if (intent === 'signup') {
    const parsed = parseWith(signupSchema, {
      username: form.get('username'),
      password: form.get('password'),
    });
    if (!parsed.ok) return data({ intent, errors: parsed.errors }, { status: 400 });
    if (await usernameTaken(db, parsed.data.username)) {
      return data(
        { intent, errors: { username: 'That username is taken. Try another one.' } },
        { status: 400 },
      );
    }
    const user = await createUser(db, parsed.data.username, parsed.data.password);
    return redirectWithToast(
      request,
      redirectTo,
      { kind: 'success', title: `Welcome, ${user.username}!`, message: 'Your account is ready.' },
      user.id,
    );
  }

  const parsed = parseWith(loginSchema, {
    username: form.get('username'),
    password: form.get('password'),
  });
  if (!parsed.ok) return data({ intent: 'login', errors: parsed.errors }, { status: 400 });
  const user = await verifyLogin(db, parsed.data.username, parsed.data.password);
  if (!user) {
    return data(
      { intent: 'login', errors: { form: 'Incorrect username or password, please try again.' } },
      { status: 400 },
    );
  }
  return redirectWithToast(
    request,
    redirectTo,
    {
      kind: 'success',
      title: `You are now logged in!`,
      message: `Welcome back, ${user.username}.`,
    },
    user.id,
  );
}

export default function Login({ loaderData, actionData }: Route.ComponentProps) {
  const { redirectTo, demoUser } = loaderData;
  const navigation = useNavigation();
  const loginErrors = actionData?.intent === 'login' ? actionData.errors : undefined;
  const signupErrors = actionData?.intent === 'signup' ? actionData.errors : undefined;
  const submitting = navigation.state !== 'idle';

  return (
    <div className="container">
      <header className="page-head">
        <h1>Log in or sign up</h1>
        <p>Read freely; log in to write posts and join the conversation.</p>
      </header>
      <div className="two-up">
        <section className="card" aria-labelledby="login-title">
          <p className="card__kicker">Already a user?</p>
          <h2 id="login-title">Log in</h2>
          {demoUser ? (
            <p className="demo-hint">
              Demo mode: try <code>{demoUser}</code> with password <code>{DEMO_PASSWORD}</code>.
            </p>
          ) : null}
          <Form method="post" className="form" noValidate aria-busy={submitting || undefined}>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <ErrorSummary
              errors={loginErrors}
              fieldIds={{ username: 'login-username', password: 'login-password' }}
            />
            <Field
              id="login-username"
              name="username"
              label="Username"
              autoComplete="username"
              spellCheck={false}
              errors={loginErrors}
            />
            <PasswordField
              id="login-password"
              name="password"
              label="Password"
              autoComplete="current-password"
              errors={loginErrors}
            />
            <SubmitButton intent="login" pendingLabel="Logging in…">
              Log in
            </SubmitButton>
          </Form>
        </section>

        <section className="card" aria-labelledby="signup-title">
          <p className="card__kicker">New to the blog?</p>
          <h2 id="signup-title">Sign up</h2>
          <Form method="post" className="form" noValidate>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <ErrorSummary
              errors={signupErrors}
              fieldIds={{ username: 'signup-username', password: 'signup-password' }}
            />
            <Field
              id="signup-username"
              name="username"
              label="New username"
              hint="3–32 characters: letters, numbers, dots, dashes or underscores."
              autoComplete="username"
              spellCheck={false}
              errors={signupErrors}
            />
            <PasswordField
              id="signup-password"
              name="password"
              label="New password"
              hint="At least 8 characters. A short phrase is easier to remember."
              autoComplete="new-password"
              errors={signupErrors}
            />
            <SubmitButton intent="signup" pendingLabel="Creating account…">
              Sign up
            </SubmitButton>
          </Form>
        </section>
      </div>
    </div>
  );
}
