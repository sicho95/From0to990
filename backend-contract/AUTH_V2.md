# Authentication / accounts v2

This document is part of the backend source of truth for the @Sites implementation.

## Goal

Replace the logical single `owner` user with real accounts while preserving the PWA's local-first behavior.

A user can:

- create an account with e-mail, unique username/pseudonym and password;
- sign in with either e-mail or username;
- use several devices with the same account;
- synchronize profile, settings, attempts, lessons, skills and errors;
- request a password-reset link by e-mail;
- remain usable offline after a successful sign-in on the device.

An administrator can:

- list/search accounts;
- block/unblock an account;
- permanently delete an account and its pedagogical data;
- keep an immutable administrative audit trail.

## Non-negotiable security rules

- Never store plaintext passwords.
- Preferred password hash: Argon2id if the @Sites runtime supplies a reviewed native implementation.
- Portable Workers fallback: PBKDF2-HMAC-SHA-256, 600,000 iterations, unique random 16+ byte salt per account.
- Add a server-only pepper before PBKDF2 using HMAC-SHA-256. The pepper is never stored in D1.
- Password length: 12–128 Unicode characters. Do not impose arbitrary composition rules.
- Session tokens and password-reset tokens are 32 cryptographically random bytes encoded base64url.
- Store only SHA-256 hashes of session/reset tokens in D1; return the raw token only once to the client.
- Browser admin uses the authenticated user role, never `ADMIN_EXPORT_TOKEN`.
- `ADMIN_EXPORT_TOKEN` remains server-only for database export/import only.
- Authentication and reset responses must use `Cache-Control: no-store`.
- Rate-limit register/login/forgot/reset.
- Login and forgot-password must not reveal whether an e-mail exists.
- Blocked users cannot login or sync. Blocking immediately revokes all sessions.
- Password reset revokes all existing sessions.
- Admin cannot block/delete itself and cannot delete the last administrator.

## Normalization

- `email_norm = trim(email).toLowerCase()`.
- `username_norm = trim(username).toLowerCase()`.
- Preserve the user's original e-mail/username casing for display.
- Username: 3–32 characters. Allow letters, numbers, `.`, `_`, `-`; reject leading/trailing whitespace.
- E-mail and username are unique through their normalized columns.

## Password derivation fallback

Workers Web Crypto supports HMAC and PBKDF2.

1. `peppered = HMAC-SHA-256(PASSWORD_PEPPER, UTF8(password))`
2. `derived = PBKDF2-HMAC-SHA-256(peppered, salt, 600000, 32 bytes)`
3. Store base64url `derived`, base64url `salt`, `password_algo='pbkdf2-sha256'`, and the parameter JSON.
4. Compare derived values in constant time.

`PASSWORD_PEPPER` is a server secret and must not appear in GitHub, the PWA, D1 exports, logs, or error messages.

## Sessions

- Multiple simultaneous device sessions are allowed.
- A successful login/register returns one opaque `sessionToken`.
- Client sends `Authorization: Bearer <sessionToken>`.
- Session lifetime: 30 days. Update `last_seen_at` on authenticated activity.
- Store only `SHA-256(sessionToken)` in `auth_sessions`.
- Logout revokes only the current session.
- Password reset/block revokes all sessions for the user.
- `/api/v1/sync` derives `user_id` exclusively from the valid bearer session. Never accept a user id from the request body.

## Multi-device synchronization

On a new device:
1. sign in;
2. local database starts clean for that account;
3. `/sync` with `cursor=null` returns that account's complete event history;
4. the PWA reconstructs profile/progress locally.

On registration from an existing legacy/local device, the PWA re-enqueues the current local snapshot once so the new account keeps that progress.

Never mix local IndexedDB data from two authenticated users. The PWA clears pedagogical stores after a safe logout and before switching to a different account unless the user explicitly requests a local merge.

## Password reset e-mail

Required server settings/secrets:

- `APP_PUBLIC_URL=https://sicho95.github.io/From0to990/`
- `PASSWORD_PEPPER`
- `PASSWORD_RESET_FROM`
- `RESEND_API_KEY` (or replace the mail adapter with an equivalent transactional provider)
- `ADMIN_BOOTSTRAP_TOKEN`
- existing `ADMIN_EXPORT_TOKEN`

`POST /auth/password/forgot` always returns HTTP 202 with the same body.

For an existing active account:
1. invalidate older unused reset tokens;
2. create a random token, store only its hash, expiry 30 minutes;
3. send `${APP_PUBLIC_URL}#/reset/<raw-token>`;
4. do not put the raw token in logs.

`POST /auth/password/reset` validates the token, replaces the password hash/salt, marks the token used and revokes all sessions.

## First administrator

Do not hardcode an admin password or token in the PWA.

After creating the owner's normal account, call `POST /api/v1/admin/bootstrap` out-of-band with `Authorization: Bearer <ADMIN_BOOTSTRAP_TOKEN>` and the account e-mail. This endpoint:
- works only while zero administrators exist;
- promotes that one account to `role=admin`;
- records an audit event;
- must never be callable from the browser UI.

After bootstrap, browser administration uses the normal user session and requires `role=admin`.

## Existing logical `owner`

Do not delete the legacy owner automatically during migration.

The current device can seed its local data into the new account on registration. Keep the legacy owner data in D1 until the migration is verified. A later one-time server-side merge may archive/delete the old owner after comparing counts and IDs.

## CORS

Allowed origin remains only:

`https://sicho95.github.io`

For v2 preflight allow:

- methods: `GET, POST, PATCH, DELETE, OPTIONS`
- headers: `Content-Type, Authorization`

Never use CORS as authentication.

## Rate limiting baseline

Server-enforced baseline:
- register: 5 attempts / IP / 15 min;
- login: 10 attempts / normalized identifier + IP / 15 min;
- forgot: 5 requests / normalized e-mail hash + IP / hour;
- reset: 10 attempts / IP / hour.

Return 429 with a generic message and `Retry-After` where appropriate.
