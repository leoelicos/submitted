import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '~/lib/password.server';

describe('password hashing', () => {
  it('round-trips and salts every hash', async () => {
    const a = await hashPassword('password12345');
    const b = await hashPassword('password12345');
    expect(a).not.toBe(b);
    expect(a.startsWith('scrypt$')).toBe(true);
    expect(await verifyPassword('password12345', a)).toBe(true);
    expect(await verifyPassword('password1234', a)).toBe(false);
  });

  it('rejects malformed hashes instead of throwing', async () => {
    expect(await verifyPassword('x', 'bcrypt$whatever')).toBe(false);
  });
});
